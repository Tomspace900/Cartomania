import unusedImports from "eslint-plugin-unused-imports";

export default [
  {
    plugins: { "unused-imports": unusedImports },
    extends: [
      "next/core-web-vitals",
      "next/typescript",
      "eslint:recommended",
      "plugin:prettier/recommended",
    ],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],
    },
  },
];
