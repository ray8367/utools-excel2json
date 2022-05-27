# utools-easy-translation utools-易翻

## 插件简介

一个以 api 驱动的翻译插件，接入常用翻译平台服务，支持多种语言互翻，即用即走、不中断、无干扰，旨在打造一个更加便捷、美观、高效的翻译插件。

## 技术栈

vue3 + vite2 + utools


## 插件功能

1. 多种语言互翻
2. 自定义翻译方式
3. 自定义首页翻译文本字体大小
4. 支持一键复制并隐藏插件
5. 命名翻译模式（大小驼峰、中下划线、大小分词、对象属性、文件路径、常量）
6. ...


## 服务申请说明

[易翻插件的相关服务申请说明 (wolai.com)](https://www.wolai.com/jtSV7oah6M7rErz2RMFzo)

## 目前支持的翻译接口及语言

### 翻译接口

- [x] 谷歌翻译
- [x] 百度翻译
- [x] 腾讯翻译
- [x] 阿里翻译
- [x] 有道翻译
- [x] 彩云小译

### 支持语言

- [x] 中文 - 简体
- [x] 中文 - 繁体
- [x] 文言文 - 百度
- [x] 英语
- [x] 日语
- [x] 俄语
- [x] 韩语
- [x] 德语
- [x] 法语

## 开发说明

### 安装依赖

```bash
yarn
```

### 开发环境运行

修改插件配置文件中的 preload 路径，并配置开发环境入口为本地服务

/public/plugin.json

```json
{
  "preload": "./preload/src/index.js",
  "development": {
    "main": "http://127.0.0.1:6789"
  }
}
```

启动开发服务器

```bash
yarn run dev
```

### 打包发布

打包 preload

```bash
yarn run p:build
```

vite 打包

```bash
yarn run build
```

修改打包后插件配置文件中的主入口文件和 preload 路径

/dist/plugin.json

```json
{
  "main": "./index.html",
  "preload": "./preload/dist/index.js"
}
```
