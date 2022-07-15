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
      'absolute-x-center': 'absolute left-1/2 -translate-x-1/2',
      'absolute-y-center': 'absolute top-1/2 -translate-y-1/2',
      'absolute-center':
        'absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2'
    }
  ],
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      // scale: 1.15,
      warn: true,
      extraProperties: {
        display: 'inline-block',
        'vertical-align': 'middle',
        'margin-top': '-1px'
      }
    })
  ],
  theme: {
    colors: {
      primary: '#165dff'
    }
  },
  transformers: [transformerDirectives(), transformerVariantGroup()]
})
