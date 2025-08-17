<template>
    <UserCard />
    <h1 class="blog-title">Blogs</h1>
    <div class="blogList">
      <a class="blog" v-for="(item, index) in posts" :href="withBase(item.regularPath)" 
         :style="shouldAnimate ? { animationDelay: `${index * 0.1}s` } : {}" 
         :class="{ 'no-animation': !shouldAnimate }" :key="index" @click="handleBlogClick">
        <div class="title">{{ item.frontMatter.title }}</div>
        <div class="meta">
          <div class="date">{{ transDate(item.frontMatter.date) }}</div>
          <div class="tags">
              <span class="tag" v-for="(tag, index) in item.frontMatter.tags" :key="tag">
                {{ `#${tag}` }}<span v-if="index < item.frontMatter.tags.length - 1">, </span>
              </span>
          </div>
        </div>
      </a>
    </div>
    <div class="pagination">
      <button class="left" v-if="pageCurrent > 1" @click="go(pageCurrent - 1)">
        Previous page
      </button>
      <div v-if="pagesNum > 1">{{ `${pageCurrent}/${pagesNum}` }}</div>
      <button
        class="right"
        v-if="pageCurrent < pagesNum"
        @click="go(pageCurrent + 1)"
      >
        Next page
      </button>
    </div>
  </template>
  <script lang="ts" setup>
  import { ref, onMounted, watch } from "vue";
  import UserCard from "../components/UserCard.vue";
  import { useData, withBase, useRoute } from "vitepress";
  interface post {
    regularPath: string;
    frontMatter: {
      title: string;
      date: string;
      tags: string[];
    };
  }
  const { theme } = useData();
  const route = useRoute();
  
  // 控制是否播放入场动画
  const shouldAnimate = ref(true);
  
  // 监听路由变化，避免从其他页面返回时触发动画
  watch(() => route.path, (newPath, oldPath) => {
    // 如果是从其他页面返回到主页，禁用动画
    if (newPath === '/' && oldPath && oldPath !== '/') {
      shouldAnimate.value = false;
      // 短暂延迟后重新启用动画
      setTimeout(() => {
        shouldAnimate.value = true;
      }, 200);
    }
  });
  
  onMounted(() => {
    // 确保页面从顶部开始
    window.scrollTo({ top: 0, behavior: 'auto' });
    
    // 检查是否是从其他页面返回
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation && navigation.type === 'back_forward') {
      shouldAnimate.value = false;
      // 短暂延迟后重新启用动画
      setTimeout(() => {
        shouldAnimate.value = true;
      }, 200);
    }
    
    // 或者检查 document.referrer 是否来自同一域名的其他页面
    if (document.referrer && document.referrer.includes(window.location.origin) && !document.referrer.includes('/#/')) {
      shouldAnimate.value = false;
      // 短暂延迟后重新启用动画
      setTimeout(() => {
        shouldAnimate.value = true;
      }, 200);
    }
  });
  
  // get posts
  let postsAll = theme.value.posts || [];
  // get postLength
  let postLength = theme.value.postLength;
  // get pageSize
  let pageSize = theme.value.pageSize;
  
  //  pagesNum
  let pagesNum =
    postLength % pageSize === 0
      ? postLength / pageSize
      : postLength / pageSize + 1;
  pagesNum = parseInt(pagesNum.toString());
  //pageCurrent
  let pageCurrent = ref(1);
  // filter index post
  //postsAll = postsAll.filter((item: post) => {
  //  return item.regularPath.indexOf("index") < 0;
  //});
  //console.log(postsAll)
  // pagination
  let allMap: { [key: number]: post[] } = {};
  for (let i = 0; i < pagesNum; i++) {
    allMap[i] = [];
  }
  let index = 0;
  for (let i = 0; i < postsAll.length; i++) {
    if (allMap[index].length > pageSize - 1) {
      index += 1;
    }
    allMap[index].push(postsAll[i]);
  }
  // set posts
  let posts = ref<post[]>([]);
  posts.value = allMap[pageCurrent.value - 1];
  
  // click pagination
  const go = (i: number) => {
    // 分页切换时禁用动画
    shouldAnimate.value = false;
    
    pageCurrent.value = i;
    posts.value = allMap[pageCurrent.value - 1];
    
    // 滚动到Blogs标题位置
    const blogTitle = document.querySelector('.blog-title');
    if (blogTitle) {
      blogTitle.scrollIntoView({ behavior: 'auto', block: 'start' });
    }
    
    // 短暂延迟后重新启用动画
    setTimeout(() => {
      shouldAnimate.value = true;
    }, 100);
  };
  // handle blog click with smooth transition
  const handleBlogClick = (event: MouseEvent) => {
    const target = event.currentTarget as HTMLElement;
    if (target) {
      // 添加点击反馈动画
      target.style.transform = 'translate(-1px, -1px) scale(0.99)';
      target.style.transition = 'all 0.1s ease';
      
      // 短暂延迟后恢复，然后进行页面跳转
      setTimeout(() => {
        target.style.transform = 'translate(-3px, -3px) scale(1.01)';
      }, 100);
    }
  };

  // timestamp transform
  const transDate = (date: string) => {
    const dateArray = date.split("-");
    let year = dateArray[0],
      month = ``,
      day = dateArray[2];
    switch (dateArray[1]) {
      case "1":
      case "01":
        month = `Jan`;
        break;
      case "2":
      case "02":
        month = `Feb`;
        break;
      case "3":
      case "03":
        month = `Mar`;
        break;
      case "4":
      case "04":
        month = `Apr`;
        break;
      case "5":
      case "05":
        month = `May`;
        break;
      case "6":
      case "06":
        month = `Jun`;
        break;
      case "7":
      case "07":
        month = `Jul`;
        break;
      case "8":
      case "08":
        month = `Aug`;
        break;
      case "9":
      case "09":
        month = `Sep`;
        break;
      case "10":
        month = `Oct`;
        break;
      case "11":
        month = `Nov`;
        break;
      case "12":
        month = `Dec`;
        break;
      default:
        month = `Month`;
    }
    return `${month} ${day}, ${year}`;
  };
  </script>
  
  <style scoped>
  .vp-doc a {
    text-decoration: none;
}

  .blog-title {
    text-align: center;
    font-weight: bold;
    font-size: 2rem;
    margin-top: 24px;
    z-index: 1;
  }
  .blogList {
    padding: 30px 0;
    padding-bottom: 30px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .blog {
    width: 95%;
    min-height: 95px ;
    align-items: flex-start;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border-radius: 18px;
    padding: 18px 20px;
    margin: 13px;
    background: var(--vp-c-bg);
    max-width: 620px;
    box-shadow: 8px 8px var(--vp-c-brand);
    border: 5px solid #3f4e4f;
    cursor: pointer;
    animation: slideInUp 0.6s ease-out both;
    opacity: 0;
    transform: translateY(30px);
  }
  
  @keyframes slideInUp {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .blog.no-animation {
    animation: none !important;
    opacity: 1 !important;
    transform: translateY(0) !important;
    transition: none !important;
  }
  
  /* 确保no-animation状态下的所有动画都被禁用 */
  .blogList .blog.no-animation {
    animation: none !important;
    opacity: 1 !important;
    transform: translateY(0) !important;
    transition: none !important;
  }
  
  /* 分页切换时完全禁用所有动画相关属性 */
  .blogList:has(.blog.no-animation) .blog {
    animation: none !important;
    opacity: 1 !important;
    transform: translateY(0) !important;
    transition: none !important;
  }
  .blog:hover {
    text-decoration: none;
    transform: translate(-3px, -3px) scale(1.01);
    box-shadow: 15px 15px var(--vp-c-brand);
  }
  
  .blog:active {
    transform: translate(-1px, -1px) scale(0.99);
    box-shadow: 6px 6px var(--vp-c-brand);
    transition: all 0.1s ease;
  }
  .title {
    color: var(--vp-c-brand-light);
    font-size: 1.4em;
    margin-bottom: 6px;
    font-weight: bold;
    /* 行距 */
    line-height: 1.3;
  }
  .date {
    /* padding-bottom: 7px; */
    margin-left: 2px;
    margin-right: 15px;
    white-space: nowrap;
  }
  
  
  .meta {
    display: flex;
    align-items: center;
    font-size: 0.9em;
    color: var(--vp-c-text-2);
    margin-top: auto;
    padding-top: 10px;
  }
  
  .tags {
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis; 
    max-width: 100%; 
  }

  .tag {
    color: var(--vp-c-brand);
    font-weight: bold;
    white-space: nowrap; 
  }
  
  @media (max-width: 600px) {
    .title {
      font-size: 1.3em;
    }
    .date {
      margin-left: 2px;
      margin-right: 10px;
    }
    .meta {
      padding-top: 8px;
    }
  }
  .pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 85%;
    max-width: 600px;
    margin: 0 auto;
    position: relative;
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
  
  .left {
    position: absolute;
    left: 0;
  }
  .right {
    position: absolute;
    right: 0;
  }
  </style>
  