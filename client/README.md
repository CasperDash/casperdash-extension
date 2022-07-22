# READ ME
This file serves the purpose of technical document for CasperDash project. Any technical configs should be updated regularly for new team members can quickly catch up.

*Last updated: Friday, 22 July 2022*

#### 1. Alias path mapping configs
Long story short, this configs saves you from this:
```
import { funcA } from "../../../actions";
```
to this:
```
import { funcA } from "@module/actions";
```

1. Update *`commonConfig.js`*
Webpack reads this configs to resolve while building correct paths.
- Open `commonConfig.js`, look for `resolve.alias` and update new path as:
```
...
  alias: {
    ... // paths
    "@cd/new_module": path.resolve(dir, 'src/path_new_module')
  }
...
```

2. Update *`.babelrc`*
`module-resolver` requires alias the same as ones defined in `commonConfig.js`
- Open `.babelrc`, look for `plugins["module-resolver"].alias` and update new path as:
```
...
"alias": {
  ...
  "@cd/new_module": "./src/path_new_module"
}
...
```

3. Update *`package.json`*
CRA requires Jest config from `"jest"` key. So we need to update `moduleNameMapper` in `"jest"` the same as `commonConfig.js`
- Open `client/package.json`, look for `jest.moduleNameMapper` and update new path as:
```
"moduleNameMapper": {
  ...
  "^@cd/new_module(.*)$": "<rootDir>/src/path_new_module$1"
}
```

4. Update *`jsconfig.json`*
VSCode requires this so the editor can understand the alias path used throughout the project.
- Open `jsconfig.json`, look for `compilerOptions.paths` and update new path as:
```
"paths: {
  ...
  "@cd/new_module/*": ["client/src/path_new_module/*"],
  ...
}
```