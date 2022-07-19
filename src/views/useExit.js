/** 退出插件 */
import { useGlobalStore } from '@/store/globalData.js'

export default function (utools) {
  const 组合键 = useMagicKeys()
  const globalStore = useGlobalStore()
  const { currentOS } = storeToRefs(globalStore)

  function 关闭当前窗口() {
    if (['Windows', 'Linux'].includes(currentOS.value)) {
      utools.simulateKeyboardTap('f4', 'alt')
    } else if (currentOS.value === 'macOS') {
      utools.simulateKeyboardTap('w', 'commond', 'shfit')
    }
  }

  // 监听esc快捷键TODO:应当再加限定条件首页才可以关闭
  watchEffect(() => {
    const windows快捷键 = 组合键['Escape']
    if (windows快捷键.value) {
      关闭当前窗口()
    }
  })
}
