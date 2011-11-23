({
    baseUrl: '.',
    name: 'almond',
    out: 'almond-noplugin.js',
    skipModuleInsertion: true,
    optimize: 'none',
    pragmas: {
        excludeAlmondPlugins: true
    }
})
