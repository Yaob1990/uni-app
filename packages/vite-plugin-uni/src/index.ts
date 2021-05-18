import { Plugin, ResolvedConfig, ViteDevServer } from 'vite'
import { UniCompiler, initUniCompiler } from '@dcloudio/uni-cli-shared'
import { Options as VueOptions } from '@vitejs/plugin-vue'
import { Options as ViteLegacyOptions } from '@vitejs/plugin-legacy'
import { VueJSXPluginOptions } from '@vue/babel-plugin-jsx'
import VueJsxPlugin from '@vitejs/plugin-vue-jsx'
import ViteLegacyPlugin from '@vitejs/plugin-legacy'

import { createConfig } from './config'
import { createConfigResolved } from './configResolved'
import { createConfigureServer } from './configureServer'
import { createHandleHotUpdate } from './handleHotUpdate'
export interface VitePluginUniOptions {
  inputDir?: string
  outputDir?: string
  vueOptions?: VueOptions
  vueJsxOptions?: VueJSXPluginOptions
  viteLegacyOptions?: ViteLegacyOptions
}
export interface VitePluginUniResolvedOptions extends VitePluginUniOptions {
  base: string
  command: ResolvedConfig['command']
  platform: UniApp.PLATFORM
  inputDir: string
  outputDir: string
  assetsDir: string
  devServer?: ViteDevServer
  compiler: UniCompiler
}

export * from './vue'

let createVueJsxPlugin: typeof VueJsxPlugin | undefined
try {
  createVueJsxPlugin = require('@vitejs/plugin-vue-jsx')
} catch (e) {}

let createViteLegacyPlugin: typeof ViteLegacyPlugin | undefined
try {
  createViteLegacyPlugin = require('@vitejs/plugin-legacy')
} catch (e) {}

export default function uniPlugin(
  rawOptions: VitePluginUniOptions = {}
): Plugin[] {
  const options: VitePluginUniResolvedOptions = {
    ...rawOptions,
    base: '/',
    assetsDir: 'assets',
    inputDir: '',
    outputDir: '',
    command: 'serve',
    platform: 'h5',
    compiler: initUniCompiler({
      root: process.env.UNI_CLI_CONTEXT || process.cwd(),
    }),
  }
  const plugins: Plugin[] = []

  if (createViteLegacyPlugin && options.viteLegacyOptions !== false) {
    plugins.push(
      ...(createViteLegacyPlugin(
        options.viteLegacyOptions
      ) as unknown as Plugin[])
    )
  }

  if (createVueJsxPlugin && options.vueJsxOptions !== false) {
    plugins.push(createVueJsxPlugin(options.vueJsxOptions))
  }
  plugins.push({
    name: 'vite:uni',
    config: createConfig(options),
    configResolved: createConfigResolved(options),
    configureServer: createConfigureServer(options),
    handleHotUpdate: createHandleHotUpdate(options),
  })
  return plugins
}
