<template>
  <div class="page-wrapper">
    <Layout>
      <template #doc-before>
        <PostHeader />
        <Category />
      </template>
      <template #doc-after>
        <div>
          <button @click="back">cd ..</button>
        </div>
      </template>
    </Layout>

    <!-- footer copyright -->
    <CopyWright />
  </div>
</template>
<script lang="ts" setup>
import { onMounted, nextTick } from "vue";
import { useRouter } from "vitepress";
import DefaultTheme from "vitepress/theme";
import CopyWright from "./FooterCopyright.vue";
import Category from "./Category.vue";
import PostHeader from "./PostHeader.vue";

const { Layout } = DefaultTheme;
const router = useRouter();

const back = () => {
  // 创建黑屏遮罩
  const blackOverlay = document.createElement('div');
  blackOverlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: var(--vp-c-bg);
    z-index: 9999;
    opacity: 0;
    transition: opacity 0.15s ease-out;
  `;
  document.body.appendChild(blackOverlay);
  
  // 显示遮罩
  requestAnimationFrame(() => {
    blackOverlay.style.opacity = '1';
  });
  
  // 短暂延迟后滚动并跳转
  setTimeout(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    history.back();
    // 清理遮罩
    setTimeout(() => {
      if (blackOverlay.parentNode) {
        blackOverlay.parentNode.removeChild(blackOverlay);
      }
    }, 200);
  }, 150);
};
</script>
<style scoped>
.page-wrapper {
  min-height: 100vh;
  opacity: 1;
  transform: translateY(0) scale(1);
  transition: opacity 0.2s ease-out;
}

button {
  display: inline-block;
  position: relative;
  color: var(--vp-c-color-d);
  cursor: pointer;
  font-size: 1.2em;
  font-weight: bold;
}

button::after {
  content: "";
  position: absolute;
  width: 100%;
  transform: scaleX(0);
  height: 2px;
  bottom: 0;
  left: 0;
  background-color: var(--vp-c-color-d);
  transform-origin: bottom right;
  transition: transform 0.25s ease-out;
}

button:hover::after {
  transform: scaleX(1);
  transform-origin: bottom left;
}

/* 文章内容简单淡入 */
:deep(.VPDoc) {
  animation: simpleFadeIn 0.5s ease-out;
}

@keyframes simpleFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
