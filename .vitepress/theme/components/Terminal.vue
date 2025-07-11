<template>
    <Teleport to="body">
      <div class="terminal-wrapper" v-show="visible">
        <transition name="terminal-fade">
          <div class="terminal-overlay" v-show="visible" @click.self="close">
            <div class="terminal-window">
              <button class="close-btn" @click="close">×</button>
              <div class="terminal-output" ref="outputRef">
                <div
                  v-for="line in output"
                  :key="line + Math.random()"
                  class="output-line"
                  v-html="line"
                ></div>
              </div>
              <div class="input-line">
                <span class="prompt">{{ shellPrompt }}</span>
                <input
                  v-model="input"
                  @keydown.enter.prevent="onEnter"
                  @keydown.up.prevent="historyUp"
                  @keydown.down.prevent="historyDown"
                  @keydown.tab.prevent="handleTab"
                  @keydown.ctrl.c.prevent="onCtrlC"
                  @compositionstart="onCompositionStart"
                  @compositionend="onCompositionEnd"
                  ref="inputRef"
                  autocomplete="off"
                  spellcheck="false"
                  lang="en"
                  inputmode="text"
                  autocapitalize="off"
                  autocorrect="off"
                />
              </div>
            </div>
          </div>
        </transition>
      </div>
    </Teleport>
  </template>
  
  
  <script setup>
  import { ref, nextTick, onMounted, computed, watch, onUnmounted } from 'vue'
  import { useData, useRouter } from 'vitepress'

  const { isDark } = useData()
  const props = defineProps({
    visible: Boolean
  })
  const emit = defineEmits(['close'])
  
  const isClosing = ref(false)
  
  const close = () => {
    if (isClosing.value) return
    isClosing.value = true
    
    // 添加关闭动画 - 先让终端窗口消失
    const terminalWindow = document.querySelector('.terminal-window')
    const terminalOverlay = document.querySelector('.terminal-overlay')
    
    if (terminalWindow) {
      terminalWindow.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
      terminalWindow.style.transform = 'scale(0.85) translateY(50px) rotateX(10deg)'
      terminalWindow.style.opacity = '0'
      terminalWindow.style.filter = 'blur(20px)'
    }
    
    // 延迟让背景毛玻璃效果淡出
    setTimeout(() => {
      if (terminalOverlay) {
        terminalOverlay.style.transition = 'all 0.3s ease-out'
        terminalOverlay.style.backdropFilter = 'blur(0px) saturate(100%) brightness(1)'
        terminalOverlay.style.webkitBackdropFilter = 'blur(0px) saturate(100%) brightness(1)'
        terminalOverlay.style.opacity = '0'
      }
    }, 200)
    
    setTimeout(() => {
      emit('close')
      isClosing.value = false
    }, 700)
  }
  
  const asciiWelcome = [
    '43 61 6C 65 62 27 73',
    '53 70 61 63 65',
    '               ',
    'Type "help" to get started.'
  ]
  const output = ref([...asciiWelcome])
  const input = ref('')
  const currentPath = ref('/posts/')
  const ROOT_DIRS = ['posts','home','archives','tags','me']
  const history = ref([])
  let historyIndex = -1
  
  const outputRef = ref(null)
  const inputRef = ref(null)
  const isFading = ref(false)
  
  const isComposing = ref(false)
  const lastCompositionEnd = ref(0) // 记录最后一次 composition 结束的时间
  const isUserAgent = navigator.userAgent.toLowerCase()
  const isChrome = isUserAgent.includes('chrome') && !isUserAgent.includes('edge')
  const isSafari = isUserAgent.includes('safari') && !isUserAgent.includes('chrome')
  
  const { theme } = useData()
  const router = useRouter()
  
  const posts = theme.value.posts || []
  const titleMap = Object.fromEntries(
    posts.map(post => {
      const fn = ((post.frontMatter.title || 'untitled') + '.md')
        .replace(/^「[^」]+」\s*/, '')
      return [fn, post]
    })
  )
  const fileNames = Object.keys(titleMap)
  const mdFiles = import.meta.glob('/posts/**/*.md', { as: 'raw' })
  
  // 滚动控制相关
  let originalScrollBehavior = ''
  let originalOverflow = ''
  
  function disableScroll() {
    const body = document.body
    originalScrollBehavior = body.style.scrollBehavior
    originalOverflow = body.style.overflow
    body.style.scrollBehavior = 'auto'
    body.style.overflow = 'hidden'
  }
  
  function enableScroll() {
    const body = document.body
    body.style.scrollBehavior = originalScrollBehavior
    body.style.overflow = originalOverflow
  }
  
  function getFileName(regPath) {
    const m = regPath.match(/\/posts\/(.*)\.html$/)
    return m ? m[1] + '.md' : ''
  }
  function scrollToBottom() {
    nextTick(() => {
      if (outputRef.value) {
        outputRef.value.scrollTop = outputRef.value.scrollHeight
      }
    })
  }
  function fadeAndJump(path) {
    if (isClosing.value) return
    isClosing.value = true
    isFading.value = true
    
    // 添加更好看的淡出动画
    const terminalWindow = document.querySelector('.terminal-window')
    const terminalOverlay = document.querySelector('.terminal-overlay')
    
    if (terminalWindow) {
      terminalWindow.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
      terminalWindow.style.transform = 'scale(0.9) translateY(-30px) rotateX(-8deg)'
      terminalWindow.style.opacity = '0'
      terminalWindow.style.filter = 'blur(25px)'
    }
    
    // 延迟让背景毛玻璃效果淡出
    setTimeout(() => {
      if (terminalOverlay) {
        terminalOverlay.style.transition = 'all 0.3s ease-out'
        terminalOverlay.style.backdropFilter = 'blur(0px) saturate(100%) brightness(1)'
        terminalOverlay.style.webkitBackdropFilter = 'blur(0px) saturate(100%) brightness(1)'
        terminalOverlay.style.opacity = '0'
      }
    }, 250)
    
    setTimeout(() => {
      router.go(path)
      isClosing.value = false
    }, 800)
  }
  function resolvePath(arg) {
    if (arg.startsWith('/')) return normalize(arg)
    let base = currentPath.value
    if (!base.endsWith('/')) base += '/'
    return normalize(base + arg)
  }
  function normalize(path) {
    const parts = path.split('/')
    const stack = []
    for (const p of parts) {
      if (p === '' || p === '.') continue
      if (p === '..') {
        if (stack.length) stack.pop()
      } else {
        stack.push(p)
      }
    }
    return '/' + stack.join('/') + (stack.length && path.endsWith('/') ? '/' : '')
  }
  async function handleCommand() {
    const raw = input.value.trim()
    output.value.push(
      `<span class="shell-prompt">${getShellPrompt()}</span> ` +
      `<span class="shell-cmd">${raw}</span>`
    )

    if (!raw) {
      return clearInput()
    }

    history.value.push(raw)
    historyIndex = history.value.length
  
    const parts = raw.split(/\s+/)
    const cmd = parts[0]
  
    if (cmd === 'pwd') {
      output.value.push(currentPath.value)
      return clearInput()
    }
  
    if (cmd === 'cd') {
      const arg = parts[1] || ''
      if (arg === '..' || arg === '../') {
        if (currentPath.value !== '/') {
          currentPath.value = '/'
        }
        return clearInput()
      }
  
      const target = resolvePath(arg)
      const dir = target.replace(/^\/|\/$/g, '')
      if (ROOT_DIRS.includes(dir)) {
        if (dir === 'home') fadeAndJump('/')
        else if (dir === 'posts') {
          currentPath.value = '/posts/'
          return clearInput()
        }
        else fadeAndJump(`/${dir}`)
        return clearInput()
      }
  
      if (target === '/posts/' || target === '/posts') {
        currentPath.value = '/posts/'
        return clearInput()
      }
  
      if (arg === '~' || target === '/') {
        currentPath.value = '/'
        return clearInput()
      }
  
      output.value.push(`bash: cd: ${arg}: No such file or directory`)
      return clearInput()
    }
  
    if (cmd === 'ls') {
      const arr = currentPath.value === '/' ? ROOT_DIRS : fileNames
      output.value.push(...prettyPrintFlex(arr))
      return clearInput()
    }
  
    {
      const m = raw.match(/^(cat|head|tail)(?:\s+-n\s+(\d+))?(?:\s+(.+))?$/)
      if (m) {
        const type = m[1], nRaw = m[2]
        let num = type === 'cat' ? null : 10
        if (nRaw) num = parseInt(nRaw, 10)
        let fn = m[3] || ''
        if (!fn) {
          output.value.push(`bash: ${type}: missing file operand`)
          return clearInput()
        }
        fn = fn.replace(/^["']|["']$/g, '')
        if (!titleMap[fn]) {
          output.value.push(`bash: ${type}: ${fn}: No such file or directory`)
          return clearInput()
        }
        output.value.push('[loading...]')
        try {
          const post = titleMap[fn]
          const rawMd = await mdFiles[`/posts/${getFileName(post.regularPath)}`]()
          const lines = rawMd.split('\n')
          output.value.pop()
          if (type === 'cat') {
            output.value.push(...lines)
          } else if (type === 'head') {
            output.value.push(...lines.slice(0, num))
          } else {
            output.value.push(...lines.slice(-num))
          }
        } catch {
          output.value.push(`bash: ${type}: ${fn}: Failed to load file.`)
        }
        return clearInput()
      }
    }
  
    if (cmd === 'help') {
      output.value.push(
        'Usage:\n' +
        '  pwd                  Print working directory\n' +
        '  ls [dir]             List files in the specified directory\n' +
        '  cd [DIR]             Change the shell working directory to DIR\n' +
        '  cat FILE             Print FILE on the standard output\n' +
        '  head [-n N] FILE     Output the first N lines of FILE (default 10)\n' +
        '  tail [-n N] FILE     Output the last N lines of FILE (default 10)\n' +
        '  clear                Clear the screen\n' +
        '  exit                 Close the terminal\n' +
        '  help                 Display this help and exit\n' +
        '\nTip: Use Tab for command & filename auto-completion'
      )
      return clearInput()
    }
  
    if (cmd === 'clear') {
      output.value.splice(0, output.value.length, ...asciiWelcome)
      return clearInput()
    }

    if (cmd === 'exit') {
      close()
      return
    }

    if (cmd === 'rm') {
      if (raw === 'rm -rf /') {
        output.value.push('You bad guy')
        return clearInput()
      }
      if (parts.length < 2) {
        output.value.push('rm: missing operand')
        return clearInput()
      }
      const target = raw.slice(cmd.length).trim().replace(/^["']|["']$/g, '')
      if (!titleMap[target]) {
        output.value.push(`rm: cannot remove '${target}': No such file or directory`)
      } else {
        output.value.push(`rm: cannot remove '${target}': Permission denied`)
      }
      return clearInput()
    }

    if (cmd === 'mv') {
      if (parts.length < 3) {
        output.value.push('mv: missing file operand')
        return clearInput()
      }
      const from = parts[1].replace(/^["']|["']$/g, '')
      const to = parts[2].replace(/^["']|["']$/g, '')
      if (!titleMap[from]) {
        output.value.push(`mv: cannot stat '${from}': No such file or directory`)
      } else {
        output.value.push(`mv: cannot move '${from}' to '${to}': Permission denied`)
      }
      return clearInput()
    }

    if (cmd === 'cp') {
      if (parts.length < 3) {
        output.value.push('cp: missing file operand')
        return clearInput()
      }
      const from = parts[1].replace(/^["']|["']$/g, '')
      const to = parts[2].replace(/^["']|["']$/g, '')
      if (!titleMap[from]) {
        output.value.push(`cp: cannot stat '${from}': No such file or directory`)
      } else {
        output.value.push(`cp: cannot copy '${from}' to '${to}': Permission denied`)
      }
      return clearInput()
    }

    if (cmd === 'sudo') {
      output.value.push('No no. You are not invited.')
      return clearInput()
    }

    output.value.push(`bash: ${cmd}: command not found`)
    clearInput()
  }
  
  function clearInput() {
    input.value = ''
    scrollToBottom()
  }
  function onCompositionStart() { 
    isComposing.value = true 
  }
  
  function onCompositionEnd() { 
    isComposing.value = false
    lastCompositionEnd.value = Date.now()
  }
  
  function onEnter() {
    if (isComposing.value) return
    
    // 为不同浏览器使用不同的时间阈值
    const threshold = isChrome ? 30 : isSafari ? 20 : 25
    const timeSinceComposition = Date.now() - lastCompositionEnd.value
    const isImmediateAfterComposition = lastCompositionEnd.value > 0 && timeSinceComposition < threshold
    
    if (isImmediateAfterComposition) { 
      return 
    }
    
    handleCommand()
  }
function handleTab() {
  lastCompositionEnd.value = 0 // 重置时间戳
  const raw = input.value
  if (!raw.includes(' ')) {
    const cmds = ['pwd', 'ls', 'cd', 'cat', 'head', 'tail', 'help', 'clear', 'exit', 'rm', 'mv', 'cp', 'sudo']
    const m = cmds.filter(c => c.startsWith(raw))
    if (m.length === 1) {
      input.value = m[0] + ' '
    }
    return
  }
  const tokens = raw.split(' ')
  const cmd = tokens[0]
  if (cmd === 'cd') {
    const arg = tokens[1] || ''
    const pref = (arg.match(/^(\.\.\/|\.\/|\/)+/) || [])[0] || ''
    const core = arg.slice(pref.length)
    const m = ROOT_DIRS.filter(d => d.startsWith(core))
    if (m.length === 1) {
      const completed = m[0].includes(' ') ? `"${m[0]}"` : m[0]
      tokens[1] = pref + completed
    }
    input.value = tokens.join(' ')
    return
  }
  if (cmd === 'head' || cmd === 'tail') {
    let idx = tokens.indexOf('-n') >= 0 ? tokens.indexOf('-n') + 2 : 1
    const arg = tokens[idx] || ''
    const pref = (arg.match(/^(\.\.\/|\.\/|\/)+/) || [])[0] || ''
    const core = arg.slice(pref.length)
    const m = fileNames.filter(f => f.startsWith(core))
    if (m.length === 1) {
      const completed = m[0].includes(' ') ? `"${m[0]}"` : m[0]
      tokens[idx] = pref + completed
    }
    input.value = tokens.join(' ')
    return
  }
  if (cmd === 'cat') {
    const arg = tokens[1] || ''
    const pref = (arg.match(/^(\.\.\/|\.\/|\/)+/) || [])[0] || ''
    const core = arg.slice(pref.length)
    const m = fileNames.filter(f => f.startsWith(core))
    if (m.length === 1) {
      const completed = m[0].includes(' ') ? `"${m[0]}"` : m[0]
      tokens[1] = pref + completed
    }
    input.value = tokens.join(' ')
    return
  }
  if (cmd === 'rm') {
    const arg = tokens[1] || ''
    const pref = (arg.match(/^(\.\.\/|\.\/|\/)+/) || [])[0] || ''
    const core = arg.slice(pref.length)
    const m = fileNames.filter(f => f.startsWith(core))
    if (m.length === 1) {
      const completed = m[0].includes(' ') ? `"${m[0]}"` : m[0]
      tokens[1] = pref + completed
    }
    input.value = tokens.join(' ')
    return
  }
  if (cmd === 'mv' || cmd === 'cp') {
    let idx = tokens.length === 2 ? 1 : 2
    const arg = tokens[idx] || ''
    const pref = (arg.match(/^(\.\.\/|\.\/|\/)+/) || [])[0] || ''
    const core = arg.slice(pref.length)
    const m = fileNames.filter(f => f.startsWith(core))
    if (m.length === 1) {
      const completed = m[0].includes(' ') ? `"${m[0]}"` : m[0]
      tokens[idx] = pref + completed
    }
    input.value = tokens.join(' ')
    return
  }
}
  function historyUp() {
    if (!history.value.length) return
    if (historyIndex > 0) {
      historyIndex--
      input.value = history.value[historyIndex]
    }
  }
  function historyDown() {
    if (!history.value.length) return
    if (historyIndex < history.value.length - 1) {
      historyIndex++
      input.value = history.value[historyIndex]
    } else {
      historyIndex = history.value.length
      input.value = ''
    }
  }
  const shellUser = 'caleb'
  const shellHost = 'space'
  function getShellPrompt() {
    let p = currentPath.value.replace(/\/$/, '')
    if (!p) p = '/'
    return `[${shellUser}@${shellHost} ${p}] λ`
  }
  const shellPrompt = computed(getShellPrompt)
 
  function prettyPrintFlex(arr) {
    const maxLen = arr.reduce((m, n) => Math.max(m, n.length), 0)
    const colWidth = maxLen + 2
    const items = arr
      .map(n => `<span class="ls-item">${n}</span>`)
      .join('')
    return [
      `<div class="ls-row" style="--ls-col-width:${colWidth}ch">` +
        items +
      `</div>`
    ]
  }
  
watch(() => props.visible, async v => {
  if (v) {
    disableScroll()
    await nextTick()
    
    // 重置终端窗口和背景样式，确保动画正常开始
    const terminalWindow = document.querySelector('.terminal-window')
    const terminalOverlay = document.querySelector('.terminal-overlay')
    
    if (terminalWindow) {
      terminalWindow.style.transition = ''
      terminalWindow.style.transform = ''
      terminalWindow.style.opacity = ''
      terminalWindow.style.filter = ''
    }
    
    if (terminalOverlay) {
      terminalOverlay.style.transition = ''
      terminalOverlay.style.backdropFilter = ''
      terminalOverlay.style.webkitBackdropFilter = ''
      terminalOverlay.style.opacity = ''
    }
    
    setTimeout(() => {
      inputRef.value?.focus()
      scrollToBottom()
    }, 100)
  } else {
    setTimeout(() => {
      enableScroll()
    }, 800)
  }
})
  
  onUnmounted(() => {
    enableScroll()
  })
  
  
  
  
function onCtrlC() {
  const current = input.value
  output.value.push(
    `<span class="shell-prompt">${getShellPrompt()}</span> <span class="shell-cmd">${current}^C</span>`
  )
  clearInput()
}
  
</script>





<style scoped>
.terminal-wrapper {
  position: fixed;
  inset: 0;
  z-index: 9999;
}

.terminal-overlay {
  position: absolute;
  inset: 0;
  background: var(--terminal-overlay);
  backdrop-filter: blur(25px) saturate(180%) brightness(0.7);
  -webkit-backdrop-filter: blur(25px) saturate(180%) brightness(0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: auto;
}

.terminal-window {
  width: 90vw;
  max-width: 800px;
  height: 80vh;
  background: var(--terminal-bg);
  backdrop-filter: blur(35px) saturate(200%) contrast(1.1);
  -webkit-backdrop-filter: blur(35px) saturate(200%) contrast(1.1);
  border-radius: 20px;
  border: 1px solid var(--terminal-border);
  box-shadow: 
    0 25px 80px rgba(0, 0, 0, 0.6),
    0 0 0 1px rgba(255, 255, 255, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  /* 移除重复的 transform-origin，这个在下面的动画部分已经设置了 */
}

.terminal-output {
  flex: 1;
  padding: 2rem 1.5rem 0.5rem;
  overflow-y: auto;
  font-family: 'Fira Mono', 'Consolas', monospace;
  font-size: 1.1rem;
  color: var(--terminal-text);
  line-height: 1.7;
  background: linear-gradient(180deg, 
    rgba(20, 20, 22, 0.3) 0%, 
    rgba(15, 15, 18, 0.2) 100%);
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.input-line {
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  background: var(--terminal-input-bg);
  border-top: 1px solid var(--terminal-border);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.prompt {
  color: var(--terminal-prompt);
  margin-right: 0.5em;
  font-weight: bold;
  font-size: 1.2em;
  text-shadow:
    0 0 4px var(--terminal-prompt),
    0 0 8px var(--terminal-prompt),
    0 0 12px var(--terminal-prompt);
}


.input-line input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: var(--terminal-text);
  font-family: inherit;
  font-size: 1.1rem;
}

.output-line {
  white-space: pre-wrap;
  word-break: break-word;
  margin-bottom: 0.2em;
}

/* Style only the prompt span inside rendered output */
.output-line ::v-deep(.shell-prompt) {
  color: var(--terminal-prompt);
  text-shadow:
    0 0 4px var(--terminal-prompt),
    0 0 8px var(--terminal-prompt),
    0 0 12px var(--terminal-prompt);
}




.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff5252 0%, #ff1744 100%);
  color: white;
  font-size: 1.3rem;
  font-weight: bold;
  border: none;
  cursor: pointer;
  z-index: 10;
  box-shadow: 
    0 4px 15px rgba(255, 82, 82, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transform: scale(1);
}

.close-btn:hover {
  background: linear-gradient(135deg, #ff1744 0%, #d50000 100%);
  transform: scale(1.1) rotate(90deg);
  box-shadow: 
    0 6px 20px rgba(255, 82, 82, 0.6),
    0 0 0 1px rgba(255, 255, 255, 0.2);
}

.close-btn:active {
  transform: scale(0.95) rotate(90deg);
}

/* ✨ 更好看的淡入淡出动画 */
.terminal-fade-enter-active {
  transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.terminal-fade-leave-active {
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.terminal-fade-enter-from {
  opacity: 0;
}

.terminal-fade-enter-from .terminal-window {
  transform: scale(0.85) translateY(60px) rotateX(15deg);
  filter: blur(15px);
  opacity: 0;
}

.terminal-fade-leave-to {
  opacity: 0;
  backdrop-filter: blur(0px) saturate(100%) brightness(1) !important;
  -webkit-backdrop-filter: blur(0px) saturate(100%) brightness(1) !important;
}

.terminal-fade-leave-to .terminal-window {
  transform: scale(0.85) translateY(50px) rotateX(10deg);
  filter: blur(20px);
  opacity: 0;
}

.terminal-fade-enter-to,
.terminal-fade-leave-from {
  opacity: 1;
}

.terminal-fade-enter-to .terminal-window,
.terminal-fade-leave-from .terminal-window {
  transform: scale(1) translateY(0) rotateX(0deg);
  filter: blur(0px);
  opacity: 1;
}

/* 为终端窗口添加过渡效果 */
.terminal-window {
  transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transform-origin: center center;
  perspective: 1000px;
}

/* 隐藏滚动条 */
.terminal-output::-webkit-scrollbar {
  display: none;
}

@media (max-width: 600px) {
  .terminal-window {
    width: 100vw;
    height: 100vh;
    border-radius: 0;
    max-width: none;
  }

  .terminal-output,
  .input-line {
    padding-left: 0.7rem;
    padding-right: 0.7rem;
  }
  
  .terminal-overlay {
    backdrop-filter: blur(15px) saturate(150%) brightness(0.8);
    -webkit-backdrop-filter: blur(15px) saturate(150%) brightness(0.8);
  }
}

@media (prefers-color-scheme: dark) {
  .prompt {
    color: #D4AF37;
    text-shadow:
      0 0 2px #D4AF37,
      0 0 4px #D4AF37;
  }
}

@media (prefers-color-scheme: light) {
  .prompt {
    color: #0f172a;
    text-shadow:
      0 0 2px #0f172a,
      0 0 4px #0f172a;
  }
}
:deep(.ls-row) {
  display: flex;
  flex-wrap: wrap;
  gap: 0 2ch;
}
:deep(.ls-item) {
  flex: 0 0 var(--ls-col-width);
  white-space: nowrap;
}

</style>

<style>
/* Global override for shell prompt inside the terminal output */
.terminal-output .shell-prompt {
  color: var(--terminal-prompt) !important;
  text-shadow:
    0 0 4px var(--terminal-prompt),
    0 0 8px var(--terminal-prompt),
    0 0 12px var(--terminal-prompt) !important;
}
</style>
  
