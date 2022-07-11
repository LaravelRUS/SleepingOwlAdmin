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
--adm-primary-darken: {!! $template->colorConvert(config('sleeping_owl.templateParam.colors.primary'), -0.15) !!};
--adm-primary-lighten: {!! $template->colorConvert(config('sleeping_owl.templateParam.colors.primary'), 0.60) !!};
@endif
@if(config('sleeping_owl.templateParam.colors.secondary'))
--adm-secondary: {{ config('sleeping_owl.templateParam.colors.secondary') }};
--adm-secondary-darken: {!! $template->colorConvert(config('sleeping_owl.templateParam.colors.secondary'), -0.15) !!};
--adm-secondary-lighten: {!! $template->colorConvert(config('sleeping_owl.templateParam.colors.secondary'), 0.60) !!};
@endif
@if(config('sleeping_owl.templateParam.colors.success'))
--adm-success: {{ config('sleeping_owl.templateParam.colors.success') }};
--adm-success-darken: {!! $template->colorConvert(config('sleeping_owl.templateParam.colors.success'), -0.15) !!};
--adm-success-lighten: {!! $template->colorConvert(config('sleeping_owl.templateParam.colors.success'), 0.60) !!};
@endif
@if(config('sleeping_owl.templateParam.colors.info'))
--adm-info: {{ config('sleeping_owl.templateParam.colors.info') }};
--adm-info-darken: {!! $template->colorConvert(config('sleeping_owl.templateParam.colors.info'), -0.15) !!};
--adm-info-lighten: {!! $template->colorConvert(config('sleeping_owl.templateParam.colors.info'), 0.60) !!};
@endif
@if(config('sleeping_owl.templateParam.colors.warning'))
--adm-warning: {{ config('sleeping_owl.templateParam.colors.warning') }};
--adm-warning-darken: {!! $template->colorConvert(config('sleeping_owl.templateParam.colors.warning'), -0.15) !!};
--adm-warning-lighten: {!! $template->colorConvert(config('sleeping_owl.templateParam.colors.warning'), 0.60) !!};
@endif
@if(config('sleeping_owl.templateParam.colors.danger'))
--adm-danger: {{ config('sleeping_owl.templateParam.colors.danger') }};
--adm-danger-darken: {!! $template->colorConvert(config('sleeping_owl.templateParam.colors.danger'), -0.15) !!};
--adm-danger-lighten: {!! $template->colorConvert(config('sleeping_owl.templateParam.colors.danger'), 0.60) !!};
@endif
@if(config('sleeping_owl.templateParam.colors.light'))
--adm-light: {{ config('sleeping_owl.templateParam.colors.light') }};
--adm-light-darken: {!! $template->colorConvert(config('sleeping_owl.templateParam.colors.light'), -0.15) !!};
--adm-light-lighten: {!! $template->colorConvert(config('sleeping_owl.templateParam.colors.light'), 0.60) !!};
@endif
@if(config('sleeping_owl.templateParam.colors.dark'))
--adm-dark: {{ config('sleeping_owl.templateParam.colors.dark') }};
--adm-dark-darken: {!! $template->colorConvert(config('sleeping_owl.templateParam.colors.dark'), -0.15) !!};
--adm-dark-lighten: {!! $template->colorConvert(config('sleeping_owl.templateParam.colors.dark'), 0.60) !!};
@endif
}
</style>
@endif
