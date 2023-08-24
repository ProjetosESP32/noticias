import { getNextRestartMillis } from './utils/time'

import '../css/app.css'

const audio = document.querySelector('audio')

const datasetFilter = (a, b) => a.dataset.index - b.dataset.index
const commonPostsPanel = Array.from(document.querySelector('[data-js="common-posts-panel"]').children).sort(
  datasetFilter,
)
const sessionPostsPanel = Array.from(document.querySelector('[data-js="session-posts-panel"]').children).sort(
  datasetFilter,
)

let usingAudio = false

const hide = el => {
  if (el.tagName === 'VIDEO') {
    el.onplay = null
    el.onpause = null
    el.currentTime = 0
  }

  el.classList.add('hidden')
}

const changePost = gen => {
  const next = gen.next()

  if (next.done) return

  const el = next.value

  if (el.tagName === 'VIDEO') {
    if (!el.muted && usingAudio) {
      changePost(gen)
      return
    }

    el.onplay = () => {
      audio.muted = !el.muted
      usingAudio = !el.muted
    }

    el.onpause = () => {
      audio.muted = false
      usingAudio = false
      hide(el)
      changePost(gen)
    }
  } else {
    setTimeout(() => {
      hide(el)
      changePost(gen)
    }, 10_000)
  }

  el.classList.remove('hidden')
  if (el.tagName === 'VIDEO') el.play().catch(console.warn)
}

const incrementIndex = (index, max) => (index + 1 < max ? index + 1 : 0)

function* nextItemWithPriority(normalPriority, highPriority, each, { normal, high } = { normal: 0, high: 0 }) {
  if (normalPriority.length === 0) return

  let normalPriorityYieldedCount = 0
  let normalPriorityIndex = normal
  let highPriorityIndex = high

  while (true) {
    if (normalPriorityYieldedCount >= each && highPriority.length > 0) {
      normalPriorityYieldedCount = 0
      yield highPriority[highPriorityIndex]
      highPriorityIndex = incrementIndex(highPriorityIndex, highPriority.length)
    } else {
      normalPriorityYieldedCount++
      yield normalPriority[normalPriorityIndex]
      normalPriorityIndex = incrementIndex(normalPriorityIndex, normalPriority.length)
    }
  }
}

const noPriorityFilter = el => !Number(el.dataset.priority)
const priorityFilter = el => !!Number(el.dataset.priority)
const separatePriorities = els => [els.filter(noPriorityFilter), els.filter(priorityFilter)]

const [commonNormal, commonHigh] = separatePriorities(commonPostsPanel)
const [sessionNormal, sessionHigh] = separatePriorities(sessionPostsPanel)

const commonGen = nextItemWithPriority(commonNormal, commonHigh, commonNormal.length > commonHigh.length ? 2 : 1)
const sessionGen = nextItemWithPriority(sessionNormal, sessionHigh, sessionNormal.length > sessionHigh.length ? 2 : 1)

changePost(commonGen)
changePost(sessionGen)

setTimeout(() => {
  location.reload()
}, getNextRestartMillis())
