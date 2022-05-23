import Driver from 'driver.js'
const driver = new Driver({
  padding: 1,
  closeBtnText: '关闭',
  animate: true,
  onReset: closeGuide
})

// 关闭引导层
function closeGuide(params) {
  console.log('params: ', params.node.id)
  const isMainGuide = params.node.id.includes('setting-wrapper') // 是否为主页引导
  const isSettingGuide = params.node.id.includes('guide-link') // 是否为设置页引导
  // abcd:这里改成从utools取值
  const firstUseMainTime = localStorage.getItem('firstUseMain') // 首次主页引导的时间
  const firstUseSettingTime = localStorage.getItem('firstUseSetting') // 首次设置页引导的时间

  if (isMainGuide && !firstUseMainTime) {
    // abcd:这里改成往utools存值
    localStorage.setItem('firstUseMain', new Date().getTime())
  }

  if (isSettingGuide && !firstUseSettingTime) {
    // abcd:这里改成往utools存值
    localStorage.setItem('firstUseSetting', new Date().getTime())
  }
}
// 设置是否需要动画
function setAnimate(hasAnimate) {
  const animate = Boolean(hasAnimate)
  driver.options.animate = animate
}

// 清除引导
export function clearGuide(clearImmediately = false) {
  if (driver.isActivated) {
    driver.reset(clearImmediately)
  }
}

// 显示引导
export function showGuide(params = {}, hasAnimate = true) {
  // 显示引导前先设置一下动画
  setAnimate(hasAnimate)
  const option = {
    element: params?.element,
    popover: {
      className: params?.popover?.className || '',
      title: params?.popover?.title || '',
      description: params?.popover?.description || '',
      position: params?.popover?.position || 'left'
    }
  }
  driver.highlight(option)
}
