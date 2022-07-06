const bodyDom = document.body // body的dom

/**
 * 设置主题
 * @param {String} val 'dark': 深色，'light': 浅色
 */
export function setTheme (val) {
  // TODO:把这个val设置到store里面
  const 是否黑色 = val === 'dark'
  document.documentElement.classList.toggle('dark', 是否黑色)
  val === 'dark'
    ? bodyDom.setAttribute('arco-theme', 'dark')
    : bodyDom.removeAttribute('arco-theme')
}
