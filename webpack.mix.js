const mix = require('laravel-mix');
const frontendEntries = require('./build/frontend-entries.json');

mix.setPublicPath('./public/default/');

mix.webpackConfig({
    stats: {
        children: true,
    },
    infrastructureLogging: {
        level: 'none'
    }
})

registerEntries(frontendEntries);

mix.options({
    processCssUrls: true,
    resourceRoot: '../',
    imgLoaderOptions: {
        enabled: false,
    },
    progress: false
});

if (mix.inProduction()) {
    mix.version();
}

mix.disableNotifications();

function registerEntries(groups) {
    const entries = Object.values(groups);

    entries.forEach(registerScripts);
    entries.forEach(registerStyles);
}

function registerScripts(group) {
    group.scripts.forEach(({ source, output }) => mix.js(source, output));
}

function registerStyles(group) {
    group.styles.forEach(({ source, output }) => mix.sass(source, output));
}

