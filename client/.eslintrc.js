// NIO_COMPONENT ui.platform
module.exports = {
	env: {
		browser: true,
		commonjs: true,
		node: true,
		es6: true,
		jest: true,
	},
	globals: {
		describe: true,
		expect: true,
		it: true,
		test: true,
		page: true,
		browser: true,
		context: true,
		jestPuppeteer: true,
		process: true,
		__dirname: true,
	},
	parserOptions: {
		ecmaVersion: 6,
		sourceType: 'module',
		ecmaFeatures: {
			jsx: true,
			modules: true,
			classes: true,
		},
	},
	parser: 'babel-eslint',
	plugins: ['react', 'import', 'deprecate', 'react-hooks'],
	settings: {
		react: {
			version: '16.5',
		},
	},
	extends: ['eslint:recommended', 'plugin:react/recommended', 'prettier'],
	rules: {
		'no-mixed-spaces-and-tabs': 0,
		'react/jsx-uses-react': 2,
		'react/jsx-uses-vars': 2,
		'no-unused-vars': 2,
		'no-var': 2,
		'jsx-quotes': [2, 'prefer-double'],
		'no-console': ['error', { allow: ['error', 'info', 'warn'] }],
		complexity: [2, 10],
		'no-multiple-empty-lines': [2, { max: 2, maxEOF: 1 }],
		//'class-methods-use-this': [2],
		'import/order': [
			2,
			{
				groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
				'newlines-between': 'never',
			},
		],
		// 'react/display-name': [1, { acceptTranspilerName: true }],
		'react/forbid-prop-types': [2, { forbid: ['any'] }],
		// 'react/jsx-boolean-value': [1, 'always'], //Value must be set for boolean attributes
		'react/jsx-closing-bracket-location': [2, 'tag-aligned'],
		'react/jsx-curly-spacing': [2, 'never'],
		// 'react/jsx-handler-names': [2, { eventHandlerPrefix: 'on' }],
		'react/jsx-indent-props': [1, 'tab'],
		'react/jsx-key': 2,
		// 'react/jsx-max-props-per-line': [2, { maximum: 1 }],
		// 'react/jsx-no-bind': 0,
		'react/jsx-no-duplicate-props': [2, { ignoreCase: true }],
		// 'react/jsx-no-literals': 1, //Missing JSX expression container around literal string
		'react/jsx-no-undef': 2,
		'react/jsx-pascal-case': 2,
		// 'react/jsx-sort-prop-types': [ 1, { callbacksLast: true, ignoreCase: true } ],
		// 'react/jsx-sort-props': 2,
		// 'react/no-danger': 2,
		'react/no-deprecated': 2,
		// 'react/no-did-mount-set-state': [ 1, 'allow-in-func' ],
		// 'react/no-did-update-set-state': [ 1, 'allow-in-func' ],
		'react/no-direct-mutation-state': 2,
		'react/no-is-mounted': 2,
		'react/no-multi-comp': 2, //Declare only one React component per file
		// 'react/no-set-state': 0,
		'react/no-string-refs': 2,
		'react/no-unknown-property': 2,
		'react/prefer-es6-class': [2, 'always'],
		'react/react-in-jsx-scope': 2,
		//'react/require-extension': 0,
		'react/self-closing-comp': 2,
		'react/sort-comp': 2,
		'react/jsx-wrap-multilines': 2,
		'react/no-find-dom-node': 1,
		// disable recommended
		'react/prop-types': 0,
		'no-restricted-syntax': [
			'error',
			{
				selector:
					"ClassDeclaration > MemberExpression.superClass[object.type='Identifier'][object.name='React'][property.type='Identifier'][property.name='Component']",
				message:
					"Use `extends Component` with `import { Component } from 'react'` instead of `extends React.Component`",
			},
			{
				selector:
					"ClassDeclaration > MemberExpression.superClass[object.type='Identifier'][object.name='React'][property.type='Identifier'][property.name='PureComponent']",
				message:
					"Use `extends PureComponent` with `import { PureComponent } from 'react'` instead of `extends React.PureComponent`",
			},
		],
		'deprecate/member-expression': [
			'error',
			{
				name: 'React.PropTypes',
				use: "`PropTypes` imported as `import PropTypes from 'prop-types'`",
			},
		],
		'react-hooks/rules-of-hooks': 2, // Checks rules of Hooks
		'react-hooks/exhaustive-deps': 2, // Checks effect dependencies
	},
};
