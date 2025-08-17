import type { Plugin } from 'markdown-it'
import type { RenderRule } from 'markdown-it/lib/renderer'

// 解析图片尺寸的辅助函数
function parseImageSize(sizeStr: string): { width?: number; height?: number } {
  if (!sizeStr) return {}
  
  const sizeMatch = sizeStr.match(/(\d+)?x(\d+)?/)
  if (sizeMatch) {
    const [, width, height] = sizeMatch
    return {
      width: width ? parseInt(width) : undefined,
      height: height ? parseInt(height) : undefined
    }
  }
  
  return {}
}

// 解析图片属性的辅助函数
function parseImageAttributes(attrs: string): {
  src: string
  alt: string
  width?: number
  height?: number
  class?: string
} {
  const srcMatch = attrs.match(/src="([^"]+)"/)
  const altMatch = attrs.match(/alt="([^"]*)"/)
  const classMatch = attrs.match(/class="([^"]+)"/)
  const sizeMatch = attrs.match(/width="(\d+)"|height="(\d+)"/)
  
  const src = srcMatch ? srcMatch[1] : ''
  const alt = altMatch ? altMatch[1] : ''
  const className = classMatch ? classMatch[1] : ''
  
  let width: number | undefined
  let height: number | undefined
  
  if (sizeMatch) {
    if (sizeMatch[1]) width = parseInt(sizeMatch[1])
    if (sizeMatch[2]) height = parseInt(sizeMatch[2])
  }
  
  return { src, alt, width, height, class: className }
}

// 生成 Vue 组件代码的函数
function generateVueComponent(attrs: string): string {
  const { src, alt, width, height, class: className } = parseImageAttributes(attrs)
  
  if (!src) return ''
  
  const props = [
    `src="${src}"`,
    alt ? `alt="${alt}"` : '',
    width ? `:width="${width}"` : '',
    height ? `:height="${height}"` : '',
    className ? `class="${className}"` : ''
  ].filter(Boolean).join(' ')
  
  return `<SmartImage ${props} />`
}

// Markdown 图片插件
export const markdownImagePlugin: Plugin = (md) => {
  // 保存原始的图片渲染规则
  const defaultRender = md.renderer.rules.image || function(tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options)
  }
  
  // 重写图片渲染规则
  md.renderer.rules.image = (tokens, idx, options, env, self) => {
    const token = tokens[idx]
    const attrs = token.attrs || []
    
    // 构建属性字符串
    const attrStr = attrs.map(([key, value]) => `${key}="${value}"`).join(' ')
    
    // 生成 Vue 组件代码
    const vueComponent = generateVueComponent(attrStr)
    
    if (vueComponent) {
      return vueComponent
    }
    
    // 如果解析失败，回退到默认渲染
    return defaultRender(tokens, idx, options, env, self)
  }
}

// 导出插件
export default markdownImagePlugin
