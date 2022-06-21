/** utools 业务逻辑 */
import { delay as 延迟 } from 'lodash-es'
import { userSettingStore as 用户设置存储 } from '@/store/userSetting'

export default function (命名模式类型, 设置弹框Ref, 用户输入) {
  const utools = window?.utools
  const 存储 = 用户设置存储()

  /** 根据关键字切换命名翻译模式 */
  function 改变命名模式类型(code) {
    // codeMode&xx
    const reg = /^codeMode__/
    if (reg.test(code)) {
      存储.setCodeMode(true)
      const modeName = code.split('__')[1]
      命名模式类型.value = modeName
    } else {
      存储.setCodeMode(false)
    }
  }

  // 初始化utools
  function utools初始化() {
    utools.onPluginEnter(({ code, payload }) => {
      设置弹框Ref.value.关闭弹窗()
      用户输入.value = code === 'anyword' ? payload : ''
      改变命名模式类型(code)
    })
    utools.subInputBlur()
  }
  // 粘贴
  async function 粘贴() {
    if (!utools) return
    const key = utools.isMacOs() ? 'command' : 'ctrl'
    await utools.simulateKeyboardTap('v', key)
  }

  // 延迟时间关闭utools
  function 延迟关闭utools(delayTime = 300) {
    if (!utools) return
    return new Promise(resolve => {
      延迟(function () {
        utools.hideMainWindow()
        resolve()
      }, delayTime)
    })
  }

  return {
    utools,
    utools初始化,
    粘贴,
    延迟关闭utools
  }
}
