import typescriptEslint from '@typescript-eslint/eslint-plugin';
import unusedImports from 'eslint-plugin-unused-imports';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
import parser from '@typescript-eslint/parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all,
});

const config = [
	{
		ignores: [
			'**/.next/',
			'**/node_modules/',
			'**/dist/',
			'**/build/',
			'**/.next/',
			'**/node_modules/',
			'**/dist/',
			'**/build/',
		],
	},
	...compat.extends(
		'next/core-web-vitals',
		'next/typescript',
		'plugin:prettier/recommended',
		'plugin:@typescript-eslint/recommended'
	),
	{
		plugins: {
			'@typescript-eslint': typescriptEslint,
			'unused-imports': unusedImports,
		},

		languageOptions: {
			parser,
		},

		rules: {
			'no-console': 'warn',
			'@typescript-eslint/no-explicit-any': 'warn',
			'@typescript-eslint/no-unused-vars': 'warn',
			'@typescript-eslint/no-empty-object-type': 'off',
			'@import/no-anonymous-default-export': 'off',
			'prefer-const': 'warn',
			quotes: ['warn', 'single'],
			'no-unused-vars': 'off',
			'unused-imports/no-unused-imports': 'error',
			'unused-imports/no-unused-vars': [
				'warn',
				{
					vars: 'all',
					varsIgnorePattern: '^_',
					args: 'after-used',
					argsIgnorePattern: '^_',
				},
			],
		},
	},
];

export default config;
