<template>
  <div class="content">
    <img :src="theme.avatar" width="135" height="135" class="avatar"  alt=""/>
  </div>
</template>
<script lang="ts" setup>
import { useData } from "vitepress";
const { theme } = useData();
</script>
<style scoped>
.content {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
}
.avatar {
  border-radius: 50%;
  border: 5px solid var(--vp-avatar-border);
}

@keyframes avatar-transform {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
.avatar:hover {
  animation: 5s linear 0s infinite avatar-transform;
}
</style>
