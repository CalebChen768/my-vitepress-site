<template>
  <Avatar @click="handleAvatarClick" />
  <div class="shareCard">
    <h1 class="title">
      <span>Hi, I'm Caleb </span>
    </h1>
    <p class="description">
      I'm currently pursuing a Master's degree in Computer Science at the Universiteit van Amsterdam.
    </p>
    <p class="description">
      I love coding, technology and exploring the world.
    </p>
  </div>
  <Terminal :visible="showTerminal" @close="showTerminal = false" />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Avatar from './Avatar.vue'
import Terminal from './Terminal.vue'

const showTerminal = ref(false)
const isMobile = ref(false)

const checkMobile = () => {
  if (typeof window !== 'undefined') {
    isMobile.value = window.innerWidth <= 768
  }
}

const handleAvatarClick = () => {
  if (!isMobile.value) {
    showTerminal.value = true
  }
}

onMounted(() => {
  checkMobile()
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', checkMobile)
  }
})
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

.highlight-major {
  color: #1e40af;
  font-weight: 700;
}

.highlight-university {
  color: #1e40af;
  font-weight: 700;
}

/* 移动端（屏幕宽度小于 768px） */
@media screen and (max-width: 768px) {
  .description {
    max-width: 90%;
    font-size: 1.2em;
    text-align: center;
  }
  
  .shareCard {
    margin-top: 1.5rem;
    margin-bottom: 1.5rem;
  }
}
</style>
