module.exports = {
	"presets": ["@babel/preset-react", "@babel/preset-env"],
  "plugins": [
    "@babel/plugin-transform-runtime",
    ["module-resolver", {
      "root": ["./src"],
      "alias": {
        "assets": "./src/assets",
        "actions": "./src/actions",
        "helpers": "./src/helpers",
        "selectors": "./src/selectors",
        "services": "./src/services",
        "shared": "./src/shared",
        "components": "./src/components",
        "common": "./src/components/Common",
        "hooks": "./src/components/hooks",
        "web": "./src/components/web",
        "web-extension": "./src/components/web-extension",
      }
    }]
    // "@babel/plugin-syntax-dynamic-import",
    // "@babel/plugin-proposal-optional-chaining",
    // // ["@babel/plugin-proposal-decorators", { legacy: true }],
    // ["@babel/plugin-proposal-class-properties", { loose: true }],
    // "@babel/plugin-proposal-function-bind",
    // "@babel/plugin-proposal-export-default-from",
    // "@babel/plugin-proposal-logical-assignment-operators",
    // ["@babel/plugin-proposal-pipeline-operator", { proposal: "minimal" }],
    // ["@babel/plugin-proposal-nullish-coalescing-operator", { loose: false }],
    // "@babel/plugin-proposal-do-expressions",
    // "@babel/plugin-proposal-function-sent",
    // "@babel/plugin-proposal-export-namespace-from",
    // "@babel/plugin-proposal-numeric-separator",
    // "@babel/plugin-proposal-throw-expressions",
    // "@babel/plugin-syntax-import-meta",
    // "@babel/plugin-proposal-json-strings",
    // "@babel/plugin-proposal-object-rest-spread"
  ],
	"ignore": ["**/__tests__", "**/*.test.js", "**/*.test.jsx"]
}