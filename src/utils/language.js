/**
 * 语言标识修正
 * 注：因为各家的语言标识不完全相同，为保持前端传入参数的一致性，将所有的语言标识以百度翻译为标准，再由各翻译模块修正
 * @param {*} options 修正选项 例：{zh:'zh-CN'}
 * @param {*} param {form,to}
 * @returns
 */
export function languageCorrection(options, { from, to }) {
  return {
    from: fn(from),
    to: fn(to)
  }

  function fn(target) {
    return options[target] || target
  }
}
