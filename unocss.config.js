import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  transformerDirectives,
  transformerVariantGroup
} from 'unocss'

export default defineConfig({
  shortcuts: [
    {
      'flex-c': 'flex items-center justify-center',
      'grid-c': 'grid place-items-center',
      'absolute-x-center': 'absolute left-1/2 transform -translate-x-1/2',
      'absolute-y-center': 'absolute top-1/2 transform -translate-y-1/2',
      'absolute-center':
        'absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2'
    }
  ],
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true
    })
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()]
})
