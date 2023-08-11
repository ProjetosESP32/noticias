import Alpine from 'alpinejs'
import { getNextRestartMillis } from './utils/time'
import { nextItem } from './utils/next_gen'

import '../css/app.css'

window.Alpine = Alpine

const audio = document.querySelector('audio')
const items = Array.from(document.querySelectorAll('video')).sort(
  (a, b) => Number(a.dataset.index) - Number(b.dataset.index),
)
const generator = nextItem(items)
let activeItem = null

function hiddenOld() {
  if (!activeItem) return

  activeItem.onplay = null
  activeItem.onpause = null
  activeItem.classList.add('hidden')
}

function changeVideo() {
  hiddenOld()

  const next = generator.next()

  if (next.done) return

  activeItem = next.value

  activeItem.classList.remove('hidden')
  activeItem.onplay = () => {
    audio.muted = !activeItem.muted
  }

  activeItem.onpause = () => {
    audio.muted = false
    changeVideo()
  }

  activeItem.play()
}

Alpine.data('timer', (length = 0, timeout = 10000) => ({
  index: 0,

  init() {
    if (length <= 1) return

    this.$nextTick(() => {
      setInterval(() => {
        if (this.index >= length - 1) {
          this.index = 0
        } else {
          this.index++
        }
      }, timeout)
    })
  },
}))

Alpine.start()

changeVideo()

setTimeout(() => {
  location.reload()
}, getNextRestartMillis())
