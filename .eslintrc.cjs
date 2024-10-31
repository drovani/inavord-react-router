/** @type {import('eslint').Linter.Config} */
module.exports = {
    root: true,
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
            jsx: true,
        },
    },
    env: {
        browser: true,
        commonjs: true,
        es6: true,
    },

    // Base config
    extends: ["eslint:recommended"],

    overrides: [
        // React
        {
            files: ["**/*.{js,jsx,ts,tsx}"],
            plugins: ["react", "jsx-a11y"],
            extends: [
                "plugin:react/recommended",
                "plugin:react/jsx-runtime",
                "plugin:react-hooks/recommended",
                "plugin:jsx-a11y/recommended",
            ],
            settings: {
                react: {
                    version: "detect",
                },
                formComponents: ["Form"],
                linkComponents: [
                    { name: "Link", linkAttribute: "to" },
                    { name: "NavLink", linkAttribute: "to" },
                ],
                "import/resolver": {
                    typescript: {},
                },
            },
        },

        // Typescript
        {
            files: ["**/*.{ts,tsx}"],
            plugins: ["@typescript-eslint", "import"],
            parser: "@typescript-eslint/parser",
            settings: {
                "import/internal-regex": "^(~/|@/)",
                "import/resolver": {
                    node: {
                        extensions: [".ts", ".tsx"],
                        paths: ["app"],
                    },
                    typescript: {
                        alwaysTryTypes: true,
                        project: "./tsconfig.json",
                    },
                    alias: {
                        map: [
                            ["@", "./app"],
                            ["~", "./app"],
                        ],
                        extensions: [".ts", ".tsx"],
                    },
                },
            },
            extends: [
                "plugin:@typescript-eslint/recommended",
                "plugin:import/recommended",
                "plugin:import/typescript",
                "prettier",
            ],
        },

        // Node
        {
            files: [".eslintrc.js"],
            env: {
                node: true,
            },
        },
    ],
};
