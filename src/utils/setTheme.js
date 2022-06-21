const bodyDom = document.body // body的dom
const isDark = useDark() // 响应式：是否为暗色

/**
 * 设置主题
 * @param {Boolean} val true: 深色，false: 浅色
 */
function setTheme (val) {
  document.documentElement.classList.toggle('dark', val)
  val
    ? bodyDom.setAttribute('arco-theme', 'dark')
    : bodyDom.removeAttribute('arco-theme')
}

// 监听是否暗色
watch(isDark, newVal => {
  setTheme(newVal)
})
