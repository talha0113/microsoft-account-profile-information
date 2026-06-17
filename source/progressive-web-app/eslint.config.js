// @ts-check
const angularPlugin = require("@angular-eslint/eslint-plugin");
const angularTemplatePlugin = require("@angular-eslint/eslint-plugin-template");
const angularTemplateParser = require("@angular-eslint/template-parser");
const typescriptPlugin = require("@typescript-eslint/eslint-plugin");
const typescriptParser = require("@typescript-eslint/parser");
const prettierPlugin = require("eslint-plugin-prettier");
const prettierConfig = require("eslint-config-prettier");

/** @type {import("eslint").Linter.Config[]} */
module.exports = [
  {
    ignores: [
      ".vitest/**",
      "Distributions/**",
      "node_modules/**",
      "Reports/**",
    ],
  },
  {
    files: ["Source/**/*.ts"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: [
          "./tsconfig.json",
        ],
        tsconfigRootDir: __dirname,
      },
    },
    plugins: {
      "@typescript-eslint": typescriptPlugin,
      "@angular-eslint": angularPlugin,
      "@angular-eslint/template": angularTemplatePlugin,
      prettier: prettierPlugin,
    },
    rules: {
      ...typescriptPlugin.configs["recommended"].rules,
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      "@angular-eslint/directive-selector": [
        "error",
        { type: "attribute", prefix: "ms", style: "camelCase" },
      ],
      "@angular-eslint/component-selector": [
        "error",
        { type: "element", prefix: "", style: "kebab-case" },
      ],
      "prettier/prettier": "error",
      ...prettierConfig.rules,
    },
  },
  {
    files: ["Source/**/*.html"],
    languageOptions: {
      parser: angularTemplateParser,
    },
    plugins: {
      "@angular-eslint/template": angularTemplatePlugin,
    },
    rules: {
      "@angular-eslint/template/banana-in-box": "error",
      "@angular-eslint/template/no-negated-async": "warn",
      "@angular-eslint/template/eqeqeq": "warn",
    },
  },
];