const mstts = require('./mstts')

// const fs = require('fs')

async function main() {
  const text =
    '客喜而笑，洗盏更酌。肴核既尽，杯盘狼籍。相与枕藉乎舟中，不知东方之既白。'
  const voice = 'zh-CN-YunjianNeural'
  const express = 'general',
    role = '',
    rate = 0,
    pitch = 0

  const mp3buffer = await mstts.getTTSData(
    text,
    voice,
    express,
    role,
    rate,
    pitch
  )

  // let output = new Date().getTime() + '.mp3'

  // fs.writeFileSync(output, mp3buffer)

  return mp3buffer
}

module.exports = main
