<template>
  <div class="main">
    <div v-for="yearList in data" class="yearItem">
      <div class="year">
        {{ yearList[0].frontMatter.date.split("-")[0] }}
      </div>
      <a
        :href="withBase(article.regularPath)"
        v-for="(article, index) in yearList"
        :key="index"
        class="article"
      >
        <div class="title">
          <div class="title-o"></div>
          {{ article.frontMatter.title }}
        </div>
        <div class="date">{{ article.frontMatter.date.slice(5) }}</div>
      </a>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useData, withBase } from "vitepress";
import { computed, onMounted } from "vue";
import { useYearSort } from "../utils/utils";

const { theme } = useData();
const data = computed(() => useYearSort(theme.value.posts));

// 确保页面从顶部开始
onMounted(() => {
  window.scrollTo({ top: 0, behavior: 'auto' });
});
</script>

<style scoped>
.main {
  margin: 0 auto;
  padding: 0.5rem 1.5rem 4rem;
  max-width: 48rem;
}
.yearItem {
  border-bottom: 1px dashed #c7c7c7;
}
.yearItem:last-child {
  border: none;
}
.year {
  padding: 16px 0 8px 0;
  font-size: 1.2rem;
  font-weight: 600;
}

.article {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
  margin: 10px 10px;
  color: var(--vp-c-text-2);
  transition: border 0.3s ease, color 0.3s ease;
}
.article:hover {
  min-width: 0;
  text-decoration: none;
  color: var(--vp-c-brand);
}
.title {
  flex: 1;
  word-break: break-word;
}

.date {
  white-space: nowrap;
  margin-left: 10px;
  font-family: Georgia, sans-serif;
}
</style>
