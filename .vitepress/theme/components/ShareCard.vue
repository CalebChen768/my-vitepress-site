<template>
  <div class="shareCard">
    <h1 class="title">
      <span>Hi, I'm Caleb </span>
    </h1>
    <p class="description">
      I’m currently pursuing a Master’s in Computer Science <br>
      at the Universiteit van Amsterdam.
    </p>
  </div>
</template>

<script lang="ts" setup></script>
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
  margin: 1.6em 0;
}
</style>
