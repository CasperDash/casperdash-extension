module.exports = {
  "roots": ["<rootDir>"],
  "transform": {
    "^.+\\.[jt]sx?$": "babel-jest"
  },
  "collectCoverageFrom": [
    "src/**/*.{js,jsx,ts,tsx}",
    "!<rootDir>/node_modules/"
  ],
  "resetMocks": false,
  "moduleNameMapper": {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/src/__mocks__/styleMock.js",
    "^.+\\.(css|scss)$": "<rootDir>/src/__mocks__/styleMock.js"
  },
  "transformIgnorePatterns": [
    "<rootDir>/node_modules/(?!lodash-es)"
  ],
  "setupFilesAfterEnv": ["jest-extended","<rootDir>/scripts/custom-test-env.js"],
  "watchPlugins": [
    "jest-watch-typeahead/filename",
    "jest-watch-typeahead/testname"
  ],
  "testEnvironment": "jsdom"
}