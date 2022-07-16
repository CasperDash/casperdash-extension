const commonPlugins = [
  "@babel/plugin-transform-runtime",
  "@babel/plugin-syntax-dynamic-import",
  "@babel/plugin-proposal-optional-chaining",
  // ["@babel/plugin-proposal-decorators", { legacy: true }],
  // ["@babel/plugin-proposal-class-properties", { loose: true }],
  "@babel/plugin-proposal-function-bind",
  "@babel/plugin-proposal-export-default-from",
  "@babel/plugin-proposal-logical-assignment-operators",
  ["@babel/plugin-proposal-pipeline-operator", { proposal: "minimal" }],
  ["@babel/plugin-proposal-nullish-coalescing-operator", { loose: false }],
  "@babel/plugin-proposal-do-expressions",
  "@babel/plugin-proposal-function-sent",
  "@babel/plugin-proposal-export-namespace-from",
  "@babel/plugin-proposal-numeric-separator",
  "@babel/plugin-proposal-throw-expressions",
  "@babel/plugin-syntax-import-meta",
  "@babel/plugin-proposal-json-strings",
  "@babel/plugin-proposal-object-rest-spread"
];

module.exports = {
	"presets": ["@babel/preset-react", "@babel/preset-env"],
  "plugins": commonPlugins,
	// "plugins": [...commonPlugins, "@babel/plugin-transform-runtime"],
	"ignore": ["**/__tests__"]
}