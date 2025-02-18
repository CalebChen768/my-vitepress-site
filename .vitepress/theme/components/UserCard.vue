<template>
  <Avatar />
  <div class="shareCard">
    <h1 class="title">
      <span>Hi, I'm Caleb </span>
    </h1>
    <p class="description">
      I’m currently pursuing a Master’s in Computer Science at the Universiteit van Amsterdam.
    </p>
  </div>
</template>

<script lang="ts" setup>
import Avatar from "./Avatar.vue";
</script>

<style scoped>
.shareCard {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 15px;
  text-align: center;
}
.title {
  display: flex;
  align-items: center;
  font-size: 2.2em;
  font-weight: bold;
}

.description {
  max-width: 600px;
  word-wrap: break-word;
  overflow-wrap: break-word;
  text-align: center;
  margin: 1rem 0;
  font-size: 1.2em;
  line-height: 1.6;
}

/* 移动端（屏幕宽度小于 768px） */
@media screen and (max-width: 768px) {
  .description {
    max-width: 90%;
    font-size: 1.2em;
    text-align: center;
  }
}
</style>
