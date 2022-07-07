/** 退出插件 */

export default function (utools) {
  const 组合键 = useMagicKeys()

  function 关闭当前窗口() {
    if (utools.isWindows() || utools.isLinux()) {
      utools.simulateKeyboardTap('f4', 'alt')
    } else if (utools.isMacOs()) {
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
