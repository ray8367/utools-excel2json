/** utools 业务逻辑 */
import { delay as 延迟 } from 'lodash-es'
import { useGlobalStore } from '@/store/globalData.js'

export default function (设置弹框Ref, 用户输入, 改变命名模式类型) {
  const utools = window?.utools
  const globalStore = useGlobalStore()
  const { currentOS } = storeToRefs(globalStore)

  // 初始化utools
  function utools初始化 () {
    utools.onPluginEnter(({ code, payload }) => {
      设置弹框Ref.value.关闭弹窗()
      let value = ''
      if (code === 'anyword' || code === 'fanyi') {
        value = payload
      }
      用户输入.value = value
      改变命名模式类型(code)
    })
    utools.subInputBlur()
  }

  // 粘贴
  async function 粘贴 () {
    if (!utools) return
    const key = currentOS.value === 'MacOS' ? 'command' : 'ctrl'
    await utools.simulateKeyboardTap('v', key)
  }

  // 延迟时间关闭utools
  function 延迟关闭utools (delayTime = 300) {
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
