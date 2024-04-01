module.exports = {
	globals: {
		uni: true,
		wx: true,
		tt:true,
		process: true
		
	},
	extends: [
		'plugin:vue/essential',
		'eslint:recommended',
		'@vue/prettier'
	],
	parserOptions: {
		'parser': 'babel-eslint'
	},
	rules: {
		'no-irregular-whitespace':0,
		'vue/multi-word-component-names': 0,
		'no-alert': 0,
		'no-dupe-keys':0,
		'no-multi-spaces': 'error', // 禁止多个空格   
		'semi': [2, 'always'], // 自动补充分号  
		'quotes': ['error', 'single'], // 使用单引号
		'no-unused-vars': [
			'error',
			{
				argsIgnorePattern: '^_',
				varsIgnorePattern: '^_',
			},
		],
		'vue/html-self-closing': [
			'error',
			{
				html: {
					void: 'always',
					normal: 'any',
					component: 'any',
				},
				svg: 'always',
				math: 'always',
			},
		],
		'vue/multi-word-component-names': 0,
		//在computed properties中禁用异步actions
		'vue/no-async-in-computed-properties': 'error',
		//不允许重复的keys
		'vue/no-dupe-keys': 'error',
		//不允许重复的attributes
		'vue/no-duplicate-attributes': 'error',
		//在 <template> 标签下不允许解析错误
		'vue/no-parsing-error': ['error', {
			'x-invalid-end-tag': false,
		}],
		//不允许覆盖保留关键字
		'vue/no-reserved-keys': 'error',
		//不允许在computed properties中出现副作用。
		'vue/no-side-effects-in-computed-properties': 'error',
		//<template>不允许key属性
		'vue/no-template-key': 'error',
		//在 <textarea> 中不允许mustaches
		'vue/no-textarea-mustache': 'error',
		//不允许在v-for或者范围内的属性出现未使用的变量定义
		'vue/no-unused-vars': 'error',
		//<component>标签需要v-bind:is属性
		'vue/require-component-is': 'error',
		// render 函数必须有一个返回值
		'vue/require-render-return': 'error',
		//保证 v-bind:key 和 v-for 指令成对出现
		'vue/require-v-for-key': 'error',
		// 检查默认的prop值是否有效
		'vue/require-valid-default-prop': 'error'
	}
};
