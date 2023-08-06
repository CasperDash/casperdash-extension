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
                this.options.basePath
            );
            const chromePath = path.join(
                compilation.options.context,
                this.options.chromePath
            );
            const firefoxPath = path.join(
                compilation.options.context,
                this.options.firefoxPath
            );
            const destPath = path.join(
                compilation.options.context,
                this.options.destPath
            );

            compiler.hooks.afterEmit.tap(
                pluginName,
                () => {
                    const baseManifest = JSON.parse(fs.readFileSync(basePath, 'utf8'));
                    const chromeManifest = JSON.parse(fs.readFileSync(chromePath, 'utf8'));
                    const fireFoxManifest = JSON.parse(fs.readFileSync(firefoxPath, 'utf8'));

                    const manifest = {
                        ...baseManifest,
                        ...chromeManifest,
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