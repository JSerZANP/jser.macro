# jser.macro

Here is a collection of some babel macros I created.

## Usage

1. install [babel-plugin-macros](https://github.com/kentcdodds/babel-plugin-macros?tab=readme-ov-file#installation) and add it to your babel config.
2. choose one macro from list below and start shipping.

## Marco List

### 1. `runCodeForEnvVar()` - run code for specific env var and strip the code if not found.

```js
import { runCodeForEnvVar } from "jser.macro";

runCodeForEnvVar("ENABLE_DEBUG", () => {
  console.log("ENABLE_DEBUG enabled! 1");
});
runCodeForEnvVar("ENABLE_ADVANCED_LOGGING", () => {
  console.log("ENABLE_ADVANCED_LOGGING enabled! 2");
});
runCodeForEnvVar("ENABLE_AB_TEST", () => {
  console.log("ENABLE_AB_TEST enabled");
});
```

Let's say if `ENABLE_DEBUG=true ENABLE_ADVANCED_LOGGING=true` is set when build,
then the built asset will be like sth below. See that the last call expression is
stripped completely.

```js
(() => {
  console.log("ENABLE_DEBUG enabled! 1");
})();
(() => {
  console.log("ENABLE_ADVANCED_LOGGING enabled! 2");
})();
```
