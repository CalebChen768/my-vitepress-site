<template>
  <Layout>
    <template #doc-before>
      <Title />
      <Category />
    </template>
    <template #doc-after>
      <div>
        <button @click="back">cd ··</button>
      </div>
    </template>
    <!-- Home slot-->
    <template #home-hero-before><HomeHero /> </template>
    <template #home-features-after> <HomePage /></template>
  </Layout>
  <!-- footer copyright -->
  <CopyWright />
</template>
<script lang="ts" setup>
import DefaultTheme from "vitepress/theme";
import HomeHero from "./HomeHero.vue";
import CopyWright from "./FooterCopyright.vue";
import HomePage from "./HomePage.vue";
import Category from "./Category.vue";
import Title from "./Title.vue";
const { Layout } = DefaultTheme;
const back = () => {
  history.back();
};
</script>
<style scoped>
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
</style>
