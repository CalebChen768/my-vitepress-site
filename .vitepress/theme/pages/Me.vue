<template>
    <div class="me-page">
      <!-- Personal Introduction -->
      <section class="intro">
        <h1 class="name">Caleb</h1>
        <p class="motto">"Stay curious. Keep learning. Always share."</p>
        <!-- <p class="description">
          I'm Caleb, <br />
          a CS student passionate about technology, building, and storytelling.<br />
          I write at <a href="https://caleb.ink" target="_blank">caleb.ink</a> <br />
          and capture the world through my lens at <a href="https://caleb.show" target="_blank">caleb.show</a>.
        </p> -->
        <p class="description">
        I'm Caleb, <br />
        a CS student passionate about tech and stories.<br />
        I love to build, explore, and capture moments.<br />
        Writing lives at <a href="https://caleb.ink" target="_blank">caleb.ink</a><br />
        Photography lives at <a href="https://caleb.show" target="_blank">caleb.show</a>.
        </p>
        <div class="social-links">
          <a href="https://github.com/CalebChen768" target="_blank">GitHub</a>
          <a href="mailto:hj.chen768@gmail.com">Email</a>
        </div>
      </section>
  
      <!-- Tech Stack -->
      <section class="block">
        <h2 class="section-title">Tech Stack</h2>
        <div class="skills-cloud">
          <span v-for="skill in skills" :key="skill" class="skill-item">{{ skill }}</span>
        </div>
      </section>
  
      <!-- Now
      <section class="block">
        <h2 class="section-title">Now</h2>
        <div class="now-section">
          <p>🚀 Building backend services with Python and C++.</p>
          <p>🛠️ Exploring cloud native technologies like Docker and Kubernetes.</p>
          <p>📝 Writing down what I learn, and sharing ideas openly.</p>
          <p>📷 Capturing moments through my lens at <a href="https://caleb.show" target="_blank">caleb.show</a>.</p>
        </div>
      </section> -->
  
      <!-- Friend Links -->
      <section class="block">
        <h2 class="section-title">Friend Links</h2>
        <div class="friends-wrapper">
          <div v-for="friend in friends" :key="friend.name" class="friend-card">
            <a :href="friend.url" target="_blank" class="friend-link">
              <img v-if="friend.avatar" :src="friend.avatar" alt="avatar" class="friend-avatar" />
              <div class="friend-name">{{ friend.name }}</div>
            </a>
          </div>
        </div>
      </section>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref } from 'vue'
  
  const skills = ref([
    'Python', 'C++', 'Docker', 'Kubernetes', 'SQL', 'Redis', 'Linux', '...'
  ])
  
  const friends = ref([
    { name: '秋夜 の ブログ', url: 'https://qiuyedx.com', avatar: 'https://avatars.githubusercontent.com/u/71062076?v=4' },
  ])
  </script>
  
  <style scoped>
  .me-page {
    margin: 0 auto;
    padding: 2rem 1.5rem 4rem;
    max-width: 48rem;
  }
  
  /* Introduction */
  .intro {
    text-align: center;
    margin-bottom: 4rem;
    padding-top: 1rem;
  }
  
  .name {
    font-size: 2.8rem;
    font-weight: bold;
    color: var(--vp-c-brand-light);
    margin: 1rem 0;
    padding-bottom: 2rem;

  }
  
  .motto {
    font-size: 1.2rem;
    font-style: italic;
    color: var(--vp-c-text-2);
    margin-bottom: 2rem;
  }
  
  .description {
    font-size: 1.1rem;
    color: var(--vp-c-text-2);
    line-height: 1.8;
    margin-bottom: 2rem;
  }
  
  .description a {
    color: var(--vp-c-brand);
    text-decoration: underline;
  }
  
  .social-links {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 1.5rem;
    font-size: 1rem;
  }
  
  .social-links a {
    color: var(--vp-c-brand-light);
    font-weight: bold;
    transition: color 0.3s;
  }
  
  .social-links a:hover {
    color: var(--vp-c-brand);
  }
  
  /* General Block */
  .block {
    margin-bottom: 4rem;
    max-width: 80%;
    margin-left: auto;
    margin-right: auto;
  }
  
  .section-title {
    font-size: 2rem;
    font-weight: bold;
    color: var(--vp-c-text-1);
    margin-bottom: 2rem;
    text-align: center;
  }
  
  /* Skills Cloud */
  .skills-cloud {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
  }
  
  .skill-item {
    padding: 0.6rem 1.2rem;
    background: var(--vp-c-bg);
    border: 1px solid var(--vp-c-border);
    border-radius: 24px;
    font-size: 1rem;
    color: var(--vp-c-brand-light);
    transition: all 0.3s ease;
  }
  
  .skill-item:hover {
    background: var(--vp-c-brand);
    color: #fff;
    transform: translateY(-3px);
  }
  
  /* Now Section */
  .now-section {
    font-size: 1.1rem;
    color: var(--vp-c-text-2);
    line-height: 2;
    text-align: center;
  }
  
  .now-section a {
    color: var(--vp-c-brand);
    text-decoration: underline;
  }
  
  /* Friend Links */
  .friends-wrapper {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 1.5rem;
  }

  .friend-card {
    background: var(--vp-c-bg);
    border-radius: 10px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s, box-shadow 0.3s;
  }

  
  .friend-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }
  
  .friend-link {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1.2rem 0.5rem;
    text-decoration: none;
  }
  
  .friend-avatar {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 0.8rem;
  }
  
  .friend-name {
    font-size: 1rem;
    color: var(--vp-c-text-1);
    font-weight: 600;
    text-align: center;
  }
  </style>