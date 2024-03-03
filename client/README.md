# READ ME

This file serves the purpose of technical document for CasperDash project. Any technical configs should be updated regularly for new team members can quickly catch up.

_Last updated: Friday, 22 July 2022_

#### 1. Alias path mapping configs

Long story short, this configs saves you from this:

```
import { funcA } from "../../../actions";
```

to this:

```
import { funcA } from "@module/actions";
```

1. Update _`commonConfig.js`_
   Webpack reads this configs to resolve while building correct paths.

-   Open `commonConfig.js`, look for `resolve.alias` and update new path as:

```
...
  alias: {
    ... // paths
    "@cd/new_module": path.resolve(dir, 'src/path_new_module')
  }
...
```

2. Update _`.babelrc`_
   `module-resolver` requires alias the same as ones defined in `commonConfig.js`

-   Open `.babelrc`, look for `plugins["module-resolver"].alias` and update new path as:

```
...
"alias": {
  ...
  "@cd/new_module": "./src/path_new_module"
}
...
```

3. Update _`package.json`_
   CRA requires Jest config from `"jest"` key. So we need to update `moduleNameMapper` in `"jest"` the same as `commonConfig.js`

-   Open `client/package.json`, look for `jest.moduleNameMapper` and update new path as:

```
"moduleNameMapper": {
  ...
  "^@cd/new_module(.*)$": "<rootDir>/src/path_new_module$1"
}
```

4. Update _`jsconfig.json`_
   VSCode requires this so the editor can understand the alias path used throughout the project.

-   Open `jsconfig.json`, look for `compilerOptions.paths` and update new path as:

```
"paths: {
  ...
  "@cd/new_module/*": ["client/src/path_new_module/*"],
  ...
}
```

#### 2. Testing custom hook

**Issue**:
When working with asynchronous code (e.g: useNavigate, Chrome storage API ) in custom hook, writing unit test becomes challenging because of its asynchronous nature. More often you find yourself mocking a function and testing the mocked function, but the function doesn't get called as expected.

**Solution**:
Some primary points to keep in mind with hook testing:

-   Use `renderHook` from `@testing-library/react-hooks` for hook testing
-   Test the right mock. This is crucial point.
-   `react-hooks-testing-library` provides us a `waitForNextUpdate` function in order to wait for the next hook update. Try with this and see if the mocked function got called correctly.

Example:
The `useNavigate()` hook returns a function, usually this hook is called inside a component. When moving it inside a hook, especially called inside `useEffect`, you'll want to see whether the `navigate` function returned from `useNavigate` was called with correct param.

```
// Start with importing and mocking `useNavigate`
import * as reactRouterDom from 'react-router-dom';
jest.mock("react-router-dom", () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn()
}));

const { useNavigate }  = reactRouterDom;

// Actual testing
// This is the returned function from `useNavigate`,
// we'll focus testing on this function
const mockNavigate = jest.fn(to => {
  console.log('Mock navigating to:: ', to);
});

it("Should test something", async () => {
  // Start with mock the function returned from `useNavigate`
  // Keep in mind we'll want to test this returned function
  // rather than the `useNavigate` hook
  useNavigate.mockImplementation(() => mockNavigate);

  // Mock async result from external methods
  asyncFunction
    .mockResolvedValueOnce({
      foo: 'bar
    });

  // Crucial point
  // Without calling `waitForNextUpdate`, `mockNavigate` never got called and unit test fails
  const { waitForNextUpdate } = renderHook(() => useWithAccount());

  await waitForNextUpdate();

  expect(useNavigate).toHaveBeenCalled();
  expect(mockNavigate).toBeCalledTimes(1);
  expect(mockNavigate).toHaveBeenCalledWith("/some-other-route");
});
```

Ref links:

-   https://stackoverflow.com/questions/66949810/how-to-mock-usenavigate-hook-in-react-router-dom
-   https://stackoverflow.com/questions/56085458/testing-custom-hook-with-react-hooks-testing-library-throws-an-error
