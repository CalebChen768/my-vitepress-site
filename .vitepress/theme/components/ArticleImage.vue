<template>
  <div class="article-image-wrapper" :class="wrapperClass">
    <!-- 占位符 -->
    <div 
      v-if="!imageLoaded && !imageError" 
      class="image-placeholder"
      :style="placeholderStyle"
    >
      <div class="placeholder-content">
        <div class="placeholder-icon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
          </svg>
        </div>
        <span class="placeholder-text">图片加载中...</span>
      </div>
    </div>
    
    <!-- 实际图片 -->
    <img
      v-show="imageLoaded"
      :src="src"
      :alt="alt"
      :class="imageClass"
      @load="onImageLoad"
      @error="onImageError"
      :style="imageStyle"
    />
    
    <!-- 加载失败的提示 -->
    <div 
      v-if="imageError" 
      class="image-error"
      :style="placeholderStyle"
    >
      <div class="error-content">
        <div class="error-icon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
        <span class="error-text">图片加载失败</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface Props {
  src: string
  alt?: string
  width?: string | number
  height?: string | number
  class?: string
  center?: boolean
  maxWidth?: string | number
}

const props = withDefaults(defineProps<Props>(), {
  alt: '',
  center: false,
  maxWidth: '100%'
})

const imageLoaded = ref(false)
const imageError = ref(false)

// 计算包装器类名
const wrapperClass = computed(() => ({
  'center': props.center
}))

// 计算占位符样式
const placeholderStyle = computed(() => ({
  width: props.width ? `${props.width}px` : '100%',
  height: props.height ? `${props.height}px` : 'auto',
  minHeight: props.height ? `${props.height}px` : '200px',
  maxWidth: props.maxWidth
}))

// 图片样式
const imageStyle = computed(() => ({
  width: props.width ? `${props.width}px` : '100%',
  height: props.height ? `${props.height}px` : 'auto',
  maxWidth: props.maxWidth,
  objectFit: 'cover',
  borderRadius: '8px'
}))

// 图片类名
const imageClass = computed(() => props.class || '')

// 图片加载成功
const onImageLoad = () => {
  imageLoaded.value = true
  imageError.value = false
}

// 图片加载失败
const onImageError = () => {
  imageError.value = true
  imageLoaded.value = false
}

// 组件挂载后预加载图片
onMounted(() => {
  const img = new Image()
  img.onload = onImageLoad
  img.onerror = onImageError
  img.src = props.src
})
</script>

<style scoped>
.article-image-wrapper {
  margin: 1rem 0;
  transition: all 0.3s ease;
}

.article-image-wrapper.center {
  text-align: center;
}

.image-placeholder,
.image-error {
  background-color: #f8f9fa;
  border: 2px dashed #dee2e6;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6c757d;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.placeholder-content,
.error-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
  padding: 2rem;
}

.placeholder-icon,
.error-icon {
  width: 48px;
  height: 48px;
  opacity: 0.6;
}

.placeholder-text,
.error-text {
  font-size: 14px;
  opacity: 0.8;
  font-weight: 500;
}

img {
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .placeholder-icon,
  .error-icon {
    width: 32px;
    height: 32px;
  }
  
  .placeholder-text,
  .error-text {
    font-size: 12px;
  }
  
  .placeholder-content,
  .error-content {
    padding: 1rem;
  }
}

/* 深色模式支持 */
@media (prefers-color-scheme: dark) {
  .image-placeholder,
  .image-error {
    background-color: #2d3748;
    border-color: #4a5568;
    color: #a0aec0;
  }
}
</style>
