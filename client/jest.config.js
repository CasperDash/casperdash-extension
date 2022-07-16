module.exports = {
  roots: ["<rootDir>"],
  "transform": {
    "^.+\\.(js|jsx)$": "babel-jest"
  },
  "collectCoverageFrom": [
    "src/**/*.{js,jsx,ts,tsx}",
    "!<rootDir>/node_modules/"
  ],
  "resetMocks": false,
  "moduleNameMapper": {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/src/__mocks__/styleMock.js",
    "^.+\\.(css|scss)$": "<rootDir>/src/__mocks__/styleMock.js",
    "^assets(.*)$": "<rootDir>/src/assets$1",
    "^actions(.*)$": "<rootDir>/src/actions$1",
    "^helpers(.*)$": "<rootDir>/src/helpers$1",
    "^selectors(.*)$": "<rootDir>/src/selectors$1",
    "^services(.*)$": "<rootDir>/src/services$1",
    "^shared(.*)$": "<rootDir>/src/shared$1",
    "^components(.*)$": "<rootDir>/src/components$1",
    "^Common(.*)$": "<rootDir>/src/components/Common$1",
    "^hooks(.*)$": "<rootDir>/src/components/hooks$1",
    "^web/(.*)$": "<rootDir>/src/components/web$1",
    "web-extension(.*)$": "<rootDir>/src/components/web-extension$1"
  },
  "transformIgnorePatterns": [
    "<rootDir>/node_modules/(?!lodash-es)"
  ],
  "setupFilesAfterEnv": ["jest-environment-jsdom-global", "jest-extended","<rootDir>/scripts/custom-test-env.js"],
  "watchPlugins": [
    "jest-watch-typeahead/filename",
    "jest-watch-typeahead/testname"
  ],
  "testEnvironment": "jsdom"
}