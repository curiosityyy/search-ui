module.exports = {
  env: {
    node: true,
    browser: true,
    commonjs: true
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:jest/recommended",
    "prettier"
  ],
  parserOptions: {
    ecmaVersion: 2021,
    ecmaFeatures: {
      jsx: true
    },
    sourceType: "module"
  },
  plugins: ["@typescript-eslint", "jest"],
  parser: "@typescript-eslint/parser",
  settings: {
    react: {
      version: "detect"
    },
    jest: {
      version: "27"
    }
  },
  rules: {
    "no-console": ["error", { allow: ["warn", "error"] }],
    "prefer-rest-params": "off",
    "@typescript-eslint/no-explicit-any": "off"
  }
};
