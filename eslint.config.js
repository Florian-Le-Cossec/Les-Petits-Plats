import js from "@eslint/js"

export default [
	js.configs.recommended,

	{
		rules: {
			"no-unused-vars": "warn",
			"no-undef": "warn",
			"indent": [
				"error",
				"tab"
			],
			"linebreak-style": [
				"error",
				"unix"
			],
			"quotes": [
				"error",
				"single"
			],
			"semi": [
				"error",
				"always"
			]
		},
	}

]