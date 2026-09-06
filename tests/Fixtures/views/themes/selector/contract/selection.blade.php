<div
    data-theme="{{ $theme->id() }}"
    data-body-class="{{ $themeConfig->get('body_default_class') }}"
    data-breadcrumbs="{{ $themeConfig->get('breadcrumbs') ? 'yes' : 'no' }}"
    data-favicon="{{ $themeConfig->get('favicon') }}"
    data-footer-visible="{{ $themeConfig->get('show_footer') ? 'yes' : 'no' }}"
    data-has-many-card="{{ $themeConfig->get('useHasManyLocalCard') ? 'yes' : 'no' }}"
    data-logo-mini="{{ $themeConfig->get('logo_mini') }}"
    data-menu-top="{{ $themeConfig->get('menu_top') }}"
    data-mode-visible="{{ $themeConfig->get('show_mode') ? 'yes' : 'no' }}"
    data-relation-card="{{ $themeConfig->get('useRelationCard') ? 'yes' : 'no' }}"
    data-sidebar-color="{{ $themeConfig->get('sidebar_background_color') }}"
    data-version="{{ $themeConfig->get('version_text') }}"
    data-version-visible="{{ $themeConfig->get('show_version') ? 'yes' : 'no' }}"
    data-wysiwyg-card="{{ $themeConfig->get('useWysiwygCard') ? 'yes' : 'no' }}"
>
    {{ $themeConfig->get('logo') }}
    {{ $themeConfig->get('footer_text') }}
</div>
