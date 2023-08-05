const fs = require('fs');
const path = require('path');
require('dotenv').config()

class WebpackExtensionPlugin {
    options;

    constructor(options) {
        this.options = options || {
            env: "dev"
        };
    }
    apply(compiler) {
        const pluginName = this.constructor.name;
        compiler.hooks.thisCompilation.tap(pluginName, (compilation) => {
            const basePath = path.join(
                compilation.options.context,
                './template/extension/manifest/base.json'
            );
            const chromePath = path.join(
                compilation.options.context,
                './template/extension/manifest/chrome.json'
            );
            const destPath = path.join(
                compilation.options.context,
                './build_extension/manifest.json'
            );

            compiler.hooks.afterEmit.tap(
                pluginName,
                () => {
                    const baseManifest = JSON.parse(fs.readFileSync(basePath, 'utf8'));
                    const chromeManifest = JSON.parse(fs.readFileSync(chromePath, 'utf8'));
        
                    const manifest = {
                        ...baseManifest,
                        ...chromeManifest,
                        test: true,
                    };

                    fs.writeFileSync(
                        destPath,
                        JSON.stringify(manifest, null, 2),
                        'utf8'
                    );
                },
              )

        });
    }
}

module.exports = WebpackExtensionPlugin;