const preset = require('./tailwind.preset.cjs')

module.exports = {
    content: ['./resources/views/themes/shadcn/**/*.blade.php'],
    presets: [preset],
}
