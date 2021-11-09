import type { ResolvedConfig } from 'vite'

export * from './ast'
export * from './url'
export * from './plugin'

// 内置组件css列表，h5平台需要合并进去首页css中
export const buildInCssSet = new Set<string>()

export function isCombineBuiltInCss(config: ResolvedConfig) {
  return config.command === 'build' && config.build.cssCodeSplit
}
