<template>
  <footer>
    Powered by
    <a :href="authorUrl" target="_blank" :title="authorName">{{ authorName }}</a>
    | Copyright © {{ startYear }}-{{ currentYear }} |
    <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank">CC BY 4.0</a>
  </footer>
</template>

<script lang="ts" setup>
import { useData } from "vitepress";

const { theme } = useData();

const currentYear = new Date().getFullYear();
const startYear = theme.value.startYear ?? currentYear;
const authorName = theme.value.authorName ?? "Unknown";
const authorUrl = theme.value.authorUrl ?? "#";
</script>

<style scoped>
footer {
  text-align: center;
  position: absolute;
  width: 100%;
  bottom: 20px;
  padding: 0 20px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text);
}
a {
  color: var(--vp-c-brand);
  font-weight: bold;
}
a:hover {
  text-decoration: none;
  color: var(--vp-c-hover);
}
</style>
