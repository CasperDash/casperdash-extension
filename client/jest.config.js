
const esModules = ['lodash-es', 'nanoid', 'konva'].join("|");

const config = {
    "testEnvironment": "jsdom",
    "setupFilesAfterEnv": [
        "<rootDir>/src/setupTests.js"
    ],
    "verbose": true,
    "transform": {
        "^.+\\.[jt]sx?$": "babel-jest",
        "\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/src/__mocks__/fileMock.js",
    },
    "collectCoverageFrom": [
        "src/**/*.{js,jsx,ts,tsx}",
        "!<rootDir>/node_modules/"
    ],
    "resetMocks": false,
    "moduleNameMapper": {
        "^.+\\.(css|scss)$": "<rootDir>/src/__mocks__/styleMock.js",
        "^@cd/assets(.*)$": "<rootDir>/src/assets$1",
        "^@cd/actions(.*)$": "<rootDir>/src/actions$1",
        "^@cd/helpers(.*)$": "<rootDir>/src/helpers$1",
        "^@cd/selectors(.*)$": "<rootDir>/src/selectors$1",
        "^@cd/libs(.*)$": "<rootDir>/src/libs$1",
        "^@cd/services(.*)$": "<rootDir>/src/services$1",
        "^@cd/shared(.*)$": "<rootDir>/src/shared$1",
        "^@cd/store(.*)$": "<rootDir>/src/store$1",
        "^@cd/config(.*)$": "<rootDir>/src/config$1",
        "^@cd/constants(.*)$": "<rootDir>/src/constants$1",
        "^@cd/common(.*)$": "<rootDir>/src/components/Common$1",
        "^@cd/hooks(.*)$": "<rootDir>/src/components/hooks$1",
        "^@cd/hocs(.*)$": "<rootDir>/src/components/hocs$1",
        "^@cd/web/(.*)$": "<rootDir>/src/components/web$1",
        "^@cd/web-extension(.*)$": "<rootDir>/src/components/web-extension$1",
        "^@cd/components(.*)$": "<rootDir>/src/components$1",
        "^@cd/app(.*)$": "<rootDir>/src/app$1",
        "@ledgerhq/devices/hid-framing": "@ledgerhq/devices/lib/hid-framing",
        "^@cd/apiServices(.*)$": "<rootDir>/src/apiServices$1",
        "^lodash-es/(.*)$": "lodash/$1",
        "^lodash-es": "lodash",
        "^nanoid(/(.*)|$)": "nanoid$1",
        "^konva(/(.*)|$)": "konva$1",
        "canvas": 'jest-canvas-mock'
    },
    "transformIgnorePatterns": [
        `<rootDir>/node_modules/(?!${esModules})`,
    ],
    "globals": {
        TextEncoder: require('util').TextEncoder,
        TextDecoder: require('util').TextDecoder,
    },
};

module.exports = config;