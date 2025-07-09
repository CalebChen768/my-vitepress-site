<template>
  <div class="avatar-wrapper" @click="$emit('click')">
    <img :src="theme.avatar" width="135" height="135" class="avatar" alt="avatar" />
  </div>
</template>

<script lang="ts" setup>
import { useData } from 'vitepress'

// 获取主题中的头像路径
const { theme } = useData()
</script>

<style scoped>
.avatar-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.3s ease;
  height: 300px;
}

.avatar {
  border-radius: 50%;
  border: 5px solid var(--vp-avatar-border, #ccc);
  transition: transform 0.6s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
}

/* 悬浮时旋转动画 */
.avatar:hover {
  transform: rotate(360deg);
}
</style>