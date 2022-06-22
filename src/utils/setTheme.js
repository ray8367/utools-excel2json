const bodyDom = document.body // body的dom
/**
 * 设置主题
 * @param {Boolean} val true: 深色，false: 浅色
 */
export function setTheme (val) {
  bodyDom.className = ''
  bodyDom.classList.add(val ? 'dark' : 'light')
  val
    ? bodyDom.setAttribute('arco-theme', 'dark')
    : bodyDom.removeAttribute('arco-theme')
}
