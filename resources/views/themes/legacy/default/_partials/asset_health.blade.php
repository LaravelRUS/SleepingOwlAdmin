@if($status)
    <div class="asset-health-status" role="status">
        <span class="asset-health-message">
            {{ trans('sleeping_owl::lang.asset_health.message', [
                'published' => $status->publishedVersion(),
                'installed' => $status->installedVersion(),
            ]) }}
        </span>

        <span class="asset-health-action">
            {{ trans('sleeping_owl::lang.asset_health.command') }}
            <code class="asset-health-command">{{ $status->updateCommand() }}</code>
        </span>
    </div>
@endif
