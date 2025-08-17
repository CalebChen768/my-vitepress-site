// 大纲导航处理器 - 只隐藏大纲导航，保留主要导航菜单
(function() {
  'use strict';
  
  // 防抖函数，减少频繁执行
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
  // 等待 DOM 加载完成
  function waitForDOM() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', handleOutlineNav);
    } else {
      handleOutlineNav();
    }
  }
  
  // 处理大纲导航
  function handleOutlineNav() {
    // 只隐藏大纲导航相关的组件
    const selectors = [
      '.VPLocalNavOutlineDropdown',
      '.VPDocOutlineDropdown',
      '.VPDocOutline',
      '.VPDocOutlineItem',
      '.VPDocOutlineTitle',
      '.VPDocOutlineBadge',
      '.VPDocOutlineLink',
      '.VPLocalNav'  // 添加对整个VPLocalNav容器的处理
    ];
    
    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        if (el && el.style.display !== 'none') {
          el.style.display = 'none';
          el.style.visibility = 'hidden';
          el.style.opacity = '0';
          el.style.height = '0';
          el.style.overflow = 'hidden';
        }
      });
    });
  }
  
  // 防抖处理的大纲导航函数
  const debouncedHandleOutlineNav = debounce(handleOutlineNav, 150);
  
  // 监听滚动事件，使用防抖减少执行频率
  let scrollTimeout;
  window.addEventListener('scroll', function() {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(debouncedHandleOutlineNav, 100);
  }, { passive: true });
  
  // 监听窗口大小变化，使用防抖减少执行频率
  window.addEventListener('resize', debouncedHandleOutlineNav, { passive: true });
  
  // 使用 MutationObserver 监听 DOM 变化，但减少执行频率
  let mutationTimeout;
  const observer = new MutationObserver(function(mutations) {
    // 检查是否有大纲导航相关的变化
    const hasOutlineChanges = mutations.some(mutation => {
      if (mutation.type === 'childList') {
        return Array.from(mutation.addedNodes).some(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            return node.classList && (
              node.classList.contains('VPLocalNavOutlineDropdown') ||
              node.classList.contains('VPDocOutlineDropdown') ||
              node.classList.contains('VPDocOutline') ||
              node.classList.contains('VPLocalNav')  // 添加对VPLocalNav的检测
            );
          }
          return false;
        });
      }
      return false;
    });
    
    if (hasOutlineChanges) {
      clearTimeout(mutationTimeout);
      mutationTimeout = setTimeout(debouncedHandleOutlineNav, 100);
    }
  });
  
  // 启动处理
  waitForDOM();
  
  // 延迟启动 MutationObserver，避免初始化时的性能影响
  setTimeout(() => {
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }, 1000);
})();
