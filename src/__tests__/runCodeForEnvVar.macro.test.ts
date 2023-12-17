import { pluginTester } from "babel-plugin-tester";
import plugin from "babel-plugin-macros";

pluginTester({
  plugin,
  snapshot: true,
  filepath: __dirname,
  formatResult: (r) => r,
  tests: [
    {
      title: "throws if no arguments",
      snapshot: false,
      error: true,
      code: `
        import {runCodeForEnvVar} from '../dist/runCodeForEnvVar.macro'
        runCodeForEnvVar()
      `,
    },
    {
      title: "throws if only 1 argument",
      snapshot: false,
      error: true,
      code: `
        import {runCodeForEnvVar} from '../dist/runCodeForEnvVar.macro'
        runCodeForEnvVar('ENABLE_DEBUG')
      `,
    },
    {
      title: "throws if only first arg is not string literal",
      snapshot: false,
      error: true,
      code: `
        import {runCodeForEnvVar} from '../dist/runCodeForEnvVar.macro'
        runCodeForEnvVar(true, () => {})
      `,
    },
    {
      title: "throws if only first arg is variable",
      snapshot: false,
      error: true,
      code: `
        import {runCodeForEnvVar} from '../dist/runCodeForEnvVar.macro'
        const variable = 'true';
        runCodeForEnvVar(variable, () => {})
      `,
    },
    {
      title: "throws if 2nd arg us not function expression",
      snapshot: false,
      error: true,
      code: `
        import {runCodeForEnvVar} from '../dist/runCodeForEnvVar.macro'
        runCodeForEnvVar('ENABLE_DEBUG', true)
      `,
    },
    {
      title: "keep the code in IIFE if target env var is 'true'",
      setup() {
        process.env.ENABLE_DEBUG = "true";
      },
      code: `
        import {runCodeForEnvVar} from '../dist/runCodeForEnvVar.macro'
        runCodeForEnvVar('ENABLE_DEBUG', () => {
          console.log('ENABLE_DEBUG enabled')
        })
      `,
    },
    {
      title: "strip the code if the target env var doesn't exist",
      setup() {
        process.env.ENABLE_DEBUG = "";
      },
      code: `
        import {runCodeForEnvVar} from '../dist/runCodeForEnvVar.macro'
        runCodeForEnvVar('ENABLE_DEBUG', () => {
          console.log('ENABLE_DEBUG enabled')
        })
      `,
    },
    {
      title: "strip the code if the target env var doesn't match",
      setup() {
        process.env.ENABLE_DEBUG = "SOME_VALUE";
      },
      code: `
        import {runCodeForEnvVar} from '../dist/runCodeForEnvVar.macro'
        runCodeForEnvVar('ENABLE_DEBUG', () => {
          console.log('ENABLE_DEBUG enabled')
        })
      `,
    },
    {
      title: "support multiple calls",
      setup() {
        process.env.ENABLE_DEBUG = "true";
      },
      code: `
        import {runCodeForEnvVar} from '../dist/runCodeForEnvVar.macro'
        runCodeForEnvVar('ENABLE_DEBUG', () => {
          console.log('ENABLE_DEBUG enabled! 1')
        })
        runCodeForEnvVar('ENABLE_DEBUG', () => {
          console.log('ENABLE_DEBUG enabled! 2')
        })
      `,
    },
    {
      title: "support multiple calls with multiple env vars",
      setup() {
        process.env.ENABLE_DEBUG = "true";
        process.env.ENABLE_ADVANCED_LOGGING = "true";
        process.env.ENABLE_AB_TEST = "false";
      },
      code: `
        import {runCodeForEnvVar} from '../dist/runCodeForEnvVar.macro'
        runCodeForEnvVar('ENABLE_DEBUG', () => {
          console.log('ENABLE_DEBUG enabled! 1')
        })
        runCodeForEnvVar('ENABLE_ADVANCED_LOGGING', () => {
          console.log('ENABLE_ADVANCED_LOGGING enabled! 2')
        })
        runCodeForEnvVar('ENABLE_AB_TEST', () => {
          console.log('ENABLE_AB_TEST enabled')
        })
      `,
    },
  ],
});
