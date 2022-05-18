module.exports = {
  plugins: ['stylelint-prettier'],
  extends: [
    'stylelint-config-standard-scss',
    'stylelint-config-recess-order',
    'stylelint-config-html/vue',
    'stylelint-config-recommended-vue',
    'stylelint-config-recommended-scss',
    'stylelint-config-prettier'
  ],
  // 不加下面这行，就可以格式化单独的scss文件，加了就可以格式化vue文件里的scss
  customSyntax: 'postcss-html',
  ignoreFiles: ["dist/**/*"],
  // 配置 rules
  rules: {
    'prettier/prettier': true,
    indentation: 2, // 缩进2空格
    'string-quotes': 'single', // 单引号
    // 禁止未知的伪类选择器。
    'selector-pseudo-class-no-unknown': [
      true,
      { ignorePseudoClasses: ['global'] }
    ],
    // 禁止未知的伪元素选择器。
    'selector-pseudo-element-no-unknown': [
      true,
      { ignorePseudoElements: ['v-deep', ':deep'] }
    ],
    'number-leading-zero': 'always', // 小于1的一直加小数点
    'no-descending-specificity': null, // 嵌套类型不建议开启，所以关闭
    'function-url-quotes': 'always', // url函数强制使用引号
    'unit-case': 'lower', // 单位大小写。指定为小写
    'color-hex-case': 'lower', // 颜色十六进制大小写。指定为小写
    'color-hex-length': 'long', // 颜色十六进制长度。指定为使用长的那一种
    'rule-empty-line-before': null, // 多个规则之间必须有空行
    'font-family-no-missing-generic-family-keyword': null, // 禁止在字体族名称列表中缺少通用族。关闭
    'selector-type-no-unknown': null, // 禁止未知的选择器类型。关闭
    'block-opening-brace-space-before': 'always', // 大括号前面空一格
    'at-rule-no-unknown': null, // 禁止未知的规则。关闭
    'no-duplicate-selectors': true, // 禁止重复的选择器。开
    'property-no-unknown': null, // 禁止未知的属性。关闭
    'no-empty-source': null, // 禁止空的样式块。关闭
    'selector-class-pattern': null, // 指定类选择器模式。关闭
    'keyframes-name-pattern': null, // 指定关键帧名称模式。关闭
    'function-no-unknown': null // 禁止未知的函数。关闭
  }
};
