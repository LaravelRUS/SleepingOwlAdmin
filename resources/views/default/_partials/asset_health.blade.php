@if($status)
    <div class="asset-health-status soa-asset-health" role="status">
        <span class="asset-health-message soa-asset-health-message">
            {{ trans('sleeping_owl::lang.asset_health.message', [
                'published' => $status->publishedVersion(),
                'installed' => $status->installedVersion(),
            ]) }}
        </span>

        <span class="asset-health-action soa-asset-health-action">
            {{ trans('sleeping_owl::lang.asset_health.command') }}
            <code class="asset-health-command soa-asset-health-command">{{ $status->updateCommand() }}</code>
        </span>
    </div>
@endif
