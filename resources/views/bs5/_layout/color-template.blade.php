@if(config('sleeping_owl.templateParam.colors'))
<style type="text/css">
:root {
    @if(config('sleeping_owl.templateParam.colors.sidebar'))
--adm-sidebar: {{ config('sleeping_owl.templateParam.colors.sidebar') }};
    @endif
    @if(config('sleeping_owl.templateParam.colors.muted'))
--adm-muted: {{ config('sleeping_owl.templateParam.colors.muted') }};
    @endif
    @if(config('sleeping_owl.templateParam.colors.bg-content'))
--adm-bg-content: {{ config('sleeping_owl.templateParam.colors.bg-content') }};
    @endif

    @if(config('sleeping_owl.templateParam.colors.primary'))
--adm-primary: {{ config('sleeping_owl.templateParam.colors.primary') }};
    @endif
    @if(config('sleeping_owl.templateParam.colors.primary-darken'))
--adm-primary-darken: {{ config('sleeping_owl.templateParam.colors.primary-darken') }};
    @endif
    @if(config('sleeping_owl.templateParam.colors.secondary'))
--adm-secondary: {{ config('sleeping_owl.templateParam.colors.secondary') }};
    @endif
    @if(config('sleeping_owl.templateParam.colors.secondary-darken'))
--adm-secondary-darken: {{ config('sleeping_owl.templateParam.colors.secondary-darken') }};
    @endif
    @if(config('sleeping_owl.templateParam.colors.success'))
--adm-success: {{ config('sleeping_owl.templateParam.colors.success') }};
    @endif
    @if(config('sleeping_owl.templateParam.colors.success-darken'))
--adm-success-darken: {{ config('sleeping_owl.templateParam.colors.success-darken') }};
    @endif
    @if(config('sleeping_owl.templateParam.colors.info'))
--adm-info: {{ config('sleeping_owl.templateParam.colors.info') }};
    @endif
    @if(config('sleeping_owl.templateParam.colors.info-darken'))
--adm-info-darken: {{ config('sleeping_owl.templateParam.colors.info-darken') }};
    @endif
    @if(config('sleeping_owl.templateParam.colors.warning'))
--adm-warning: {{ config('sleeping_owl.templateParam.colors.warning') }};
    @endif
    @if(config('sleeping_owl.templateParam.colors.warning-darken'))
--adm-warning-darken: {{ config('sleeping_owl.templateParam.colors.warning-darken') }};
    @endif
    @if(config('sleeping_owl.templateParam.colors.danger'))
--adm-danger: {{ config('sleeping_owl.templateParam.colors.danger') }};
    @endif
    @if(config('sleeping_owl.templateParam.colors.danger-darken'))
--adm-danger-darken: {{ config('sleeping_owl.templateParam.colors.danger-darken') }};
    @endif
    @if(config('sleeping_owl.templateParam.colors.light'))
--adm-light: {{ config('sleeping_owl.templateParam.colors.light') }};
    @endif
    @if(config('sleeping_owl.templateParam.colors.light-darken'))
--adm-light-darken: {{ config('sleeping_owl.templateParam.colors.light-darken') }};
    @endif
    @if(config('sleeping_owl.templateParam.colors.dark'))
--adm-dark: {{ config('sleeping_owl.templateParam.colors.dark') }};
    @endif
    @if(config('sleeping_owl.templateParam.colors.dark-darken'))
--adm-dark-darken: {{ config('sleeping_owl.templateParam.colors.dark-darken') }};
@endif
}
</style>
@endif
