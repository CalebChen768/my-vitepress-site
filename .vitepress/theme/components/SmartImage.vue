<template>
  <div class="smart-image-container" :style="containerStyle">
    <!-- 占位符 -->
    <div 
      v-if="!imageLoaded" 
      class="image-placeholder"
      :style="placeholderStyle"
    >
      <div class="placeholder-content">
        <svg class="placeholder-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
        </svg>
        <span class="placeholder-text">图片加载中...</span>
      </div>
    </div>
    
    <!-- 实际图片 -->
    <img
      v-show="imageLoaded"
      :src="src"
      :alt="alt"
      :width="width"
      :height="height"
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
        <svg class="error-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
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
  placeholderColor?: string
  placeholderBgColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  alt: '',
  placeholderColor: '#9ca3af',
  placeholderBgColor: '#f3f4f6'
})

const imageLoaded = ref(false)
const imageError = ref(false)

// 计算容器样式
const containerStyle = computed(() => ({
  width: props.width ? `${props.width}px` : 'auto',
  height: props.height ? `${props.height}px` : 'auto',
  display: 'inline-block',
  position: 'relative'
}))

// 计算占位符样式
const placeholderStyle = computed(() => ({
  width: '100%',
  height: '100%',
  backgroundColor: props.placeholderBgColor,
  border: `1px solid ${props.placeholderColor}20`,
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: props.placeholderColor
}))

// 图片样式
const imageStyle = computed(() => ({
  width: '100%',
  height: '100%',
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
.smart-image-container {
  transition: all 0.3s ease;
}

.image-placeholder,
.image-error {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.placeholder-content,
.error-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
}

.placeholder-icon,
.error-icon {
  width: 32px;
  height: 32px;
  opacity: 0.6;
}

.placeholder-text,
.error-text {
  font-size: 12px;
  opacity: 0.8;
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
    width: 24px;
    height: 24px;
  }
  
  .placeholder-text,
  .error-text {
    font-size: 11px;
  }
}
</style>
