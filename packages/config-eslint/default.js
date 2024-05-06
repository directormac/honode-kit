/** @type { import("eslint").Linter.Config } */
module.exports = {
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'@hono/eslint-config',
		'prettier',
		'drizzle'
	]
};
