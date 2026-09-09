module.exports = {
    theme: {
        colors: {
            accent: 'var(--soa-accent-color)',
            background: 'var(--soa-page-background-color)',
            border: 'var(--soa-border-color)',
            current: 'currentColor',
            danger: 'var(--soa-danger-color)',
            foreground: 'var(--soa-text-color)',
            info: 'var(--soa-info-color)',
            muted: 'var(--soa-muted-surface-color)',
            primary: 'var(--soa-primary-color)',
            success: 'var(--soa-success-color)',
            surface: 'var(--soa-surface-color)',
            transparent: 'transparent',
            warning: 'var(--soa-warning-color)',
            white: 'var(--soa-on-primary-color)',
        },
        extend: {
            borderRadius: {
                DEFAULT: 'var(--soa-border-radius)',
                lg: 'var(--soa-border-radius-lg)',
                sm: 'var(--soa-border-radius-sm)',
            },
            boxShadow: {
                DEFAULT: 'var(--soa-shadow-sm)',
                md: 'var(--soa-shadow-md)',
            },
            fontFamily: {
                mono: 'var(--soa-font-family-mono)',
                sans: 'var(--soa-font-family-sans)',
            },
        },
    },
}
