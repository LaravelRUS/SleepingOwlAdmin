const runtime = globalThis.Admin.Vue.runtime
const pluginKey = Symbol.for('soa.fixture.custom-plugin')
const packageHost = globalThis.document.querySelector('#package-island')
const packageApp = globalThis.Admin.VueApps.get(packageHost)

globalThis.__customPluginInstalls = 0
globalThis.Admin.Vue.use(
    {
        install(app, label) {
            globalThis.__customPluginInstalls += 1
            app.provide(pluginKey, label)
        },
    },
    'plugin-ready',
)

const CustomCounter = runtime.defineComponent({
    name: 'CustomCounterFixture',
    props: {
        start: { default: 0, type: Number },
    },
    setup(props) {
        const count = runtime.ref(props.start)
        const pluginValue = runtime.inject(pluginKey)

        return () =>
            runtime.h(
                'button',
                {
                    class: 'custom-counter',
                    onClick: () => {
                        count.value += 1
                    },
                    type: 'button',
                },
                `${pluginValue}:${count.value}`,
            )
    },
})

globalThis.Admin.Vue.register('custom-counter', CustomCounter)
globalThis.__packageAppPreserved = packageApp === globalThis.Admin.VueApps.get(packageHost)
globalThis.__customRuntimeVersion = globalThis.Admin.Vue.version
globalThis.document.documentElement.dataset.ready = 'true'
