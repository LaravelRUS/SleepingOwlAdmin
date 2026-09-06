<div
    data-theme="{{ $theme->id() }}"
    data-body-class="{{ $themeConfig->get('body_default_class') }}"
    data-footer-visible="{{ $themeConfig->get('show_footer') ? 'yes' : 'no' }}"
>
    {{ $themeConfig->get('footer_text') }}
</div>
