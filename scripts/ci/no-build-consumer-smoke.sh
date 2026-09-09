#!/usr/bin/env bash

set -Eeuo pipefail

readonly PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
readonly WORK_ROOT="$(mktemp -d "${TMPDIR:-/tmp}/sleepingowl-no-build.XXXXXX")"
readonly PACKAGE_ROOT="${WORK_ROOT}/package"
readonly APP_ROOT="${WORK_ROOT}/application"
readonly NODE_GUARD_ROOT="${WORK_ROOT}/no-node"
readonly NODE_GUARD_LOG="${WORK_ROOT}/node-command.log"
readonly ARCHIVE="${WORK_ROOT}/sleepingowl-no-build.zip"

cleanup() {
    rm -rf "${WORK_ROOT}"
}

install_node_guard() {
    mkdir -p "${NODE_GUARD_ROOT}"

    local command
    for command in node nodejs npm npx pnpm yarn bun; do
        printf '#!/usr/bin/env sh\nprintf "%%s\\n" "$0" >> "$SOA_NODE_GUARD_LOG"\necho "Frontend command is forbidden in the no-build smoke: %s" >&2\nexit 97\n' "${command}" > "${NODE_GUARD_ROOT}/${command}"
        chmod +x "${NODE_GUARD_ROOT}/${command}"
    done

    export SOA_NODE_GUARD_LOG="${NODE_GUARD_LOG}"
    export PATH="${NODE_GUARD_ROOT}:${PATH}"
}

create_release_artifact() {
    (
        cd "${PROJECT_ROOT}"
        composer archive \
            --format=zip \
            --file=sleepingowl-no-build \
            --dir="${WORK_ROOT}" \
            --no-interaction
    )

    unzip -q "${ARCHIVE}" -d "${PACKAGE_ROOT}"
}

assert_artifact_boundary() {
    test -f "${PACKAGE_ROOT}/composer.json"
    test -f "${PACKAGE_ROOT}/public/default/asset-manifest.json"
    test -f "${PACKAGE_ROOT}/public/default/profiles/production/js/admin-core.js"
    test -f "${PACKAGE_ROOT}/public/default/profiles/development/js/admin-core.js"
    test -f "${PACKAGE_ROOT}/public/default/profiles/production/css/themes/shadcn-utilities.css"
    test -f "${PACKAGE_ROOT}/public/default/profiles/development/css/themes/shadcn-utilities.css"
    test ! -d "${PACKAGE_ROOT}/node_modules"
    test ! -d "${PACKAGE_ROOT}/vendor"
}

create_clean_application() {
    composer create-project laravel/laravel:^12.0 "${APP_ROOT}" \
        --no-interaction \
        --no-progress \
        --prefer-dist

    composer --working-dir="${APP_ROOT}" config repositories.sleepingowl path "${PACKAGE_ROOT}"

    COMPOSER_MIRROR_PATH_REPOS=1 composer --working-dir="${APP_ROOT}" require \
        laravelrus/sleepingowl:dev-main \
        --no-interaction \
        --no-progress \
        --prefer-dist
}

run_consumer_workflow() {
    php "${APP_ROOT}/artisan" sleepingowl:install --no-interaction
    php "${APP_ROOT}/artisan" sleepingowl:update --no-interaction
    php "${APP_ROOT}/artisan" sleepingowl:update --check --no-interaction
    php "${PROJECT_ROOT}/scripts/ci/verify-no-build-consumer.php" "${APP_ROOT}" adminlte
    assert_check_is_read_only
    select_shadcn_theme
    php "${APP_ROOT}/artisan" sleepingowl:update --check --no-interaction
    php "${PROJECT_ROOT}/scripts/ci/verify-no-build-consumer.php" "${APP_ROOT}" shadcn
    select_empty_theme
    php "${APP_ROOT}/artisan" sleepingowl:update --check --no-interaction
    php "${PROJECT_ROOT}/scripts/ci/verify-no-build-consumer.php" "${APP_ROOT}" empty
    ADMIN_DEV_ASSETS=true php "${APP_ROOT}/artisan" sleepingowl:update --no-interaction
    php "${APP_ROOT}/artisan" route:list --path=admin --no-ansi > /dev/null
}

select_shadcn_theme() {
    export SLEEPINGOWL_TEMPLATE=shadcn
}

select_empty_theme() {
    export SLEEPINGOWL_TEMPLATE=empty
}

assert_check_is_read_only() {
    local manifest="${APP_ROOT}/public/packages/sleepingowl/default/asset-manifest.json"
    local invalid_manifest='{"invalid":true}'

    printf '%s' "${invalid_manifest}" > "${manifest}"
    if php "${APP_ROOT}/artisan" sleepingowl:update --check --no-interaction; then
        echo 'The read-only asset check accepted an invalid manifest.' >&2
        return 1
    fi

    test "$(< "${manifest}")" = "${invalid_manifest}"
    php "${APP_ROOT}/artisan" sleepingowl:update --no-interaction
}

assert_no_frontend_toolchain() {
    test ! -d "${APP_ROOT}/node_modules"
    test ! -L "${APP_ROOT}/vendor/laravelrus/sleepingowl"

    if test -s "${NODE_GUARD_LOG}"; then
        echo "A frontend command was invoked during the no-build smoke:" >&2
        sed 's/^/  /' "${NODE_GUARD_LOG}" >&2
        return 1
    fi
}

main() {
    trap cleanup EXIT
    install_node_guard
    create_release_artifact
    assert_artifact_boundary
    create_clean_application
    run_consumer_workflow
    assert_no_frontend_toolchain

    echo 'No-build consumer smoke passed.'
}

main "$@"
