<template>
  <footer>
    <p>
      Theme by
      <a :href="themeAuthorURL" target="_blank" :title="themeAuthorName">{{ themeAuthorName }}</a> |
      Powered by
      <a href="https://vitepress.vuejs.org/" target="_blank">VitePress</a> |
      Copyright © {{ startYear }}-{{ currentYear }} |
      <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank">CC BY 4.0</a>
    </p>
  </footer>
</template>

<script lang="ts" setup>
import { useData } from "vitepress";

const { theme } = useData();

const currentYear = new Date().getFullYear();
const startYear = theme.value.startYear ?? currentYear;
const themeAuthorName = theme.value.themeAuthorName ?? "Unknown";
const themeAuthorURL = theme.value.themeAuthorURL ?? "#";
</script>

<style scoped>
footer {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: var(--vp-layout-max-width, 1200px);
  margin: 0 auto;
  padding: 15px 20px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text);
  font-size: 16px;
}

p {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  white-space: nowrap;
}

a {
  color: var(--vp-c-brand);
  font-weight: 600;
  text-decoration: none;
  border-bottom: 1px dashed var(--vp-c-brand);
}

a:hover {
  color: var(--vp-c-hover);
  border-bottom: 1px solid var(--vp-c-hover);
}

@media (max-width: 768px) {
  p {
    flex-wrap: wrap;
    text-align: center;
    white-space: normal;
  }
}
</style>
