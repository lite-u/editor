import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
    {ignores: ['dist']},
    {
        extends: [js.configs.recommended, ...tseslint.configs.recommended],
        files: ['**/*.{ts}'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
        plugins: {

        },
        rules: {
            'semi': ['error', 'never'],
            "@typescript-eslint/ban-ts-comment": [
                "error",
                {
                    "ts-check": true,
                    "ts-expect-error": false,
                    "ts-ignore": false,
                    "ts-nocheck": false
                }
            ]
        },
    },
)
