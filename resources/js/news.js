const audio = document.querySelector('audio')
const imgs = document.querySelectorAll('img')
const videos = document.querySelectorAll('video')
const items = [...imgs, ...videos].sort((a, b) => Number(a.dataset.index) - Number(b.dataset.index))
const nextItem = makeNextGetter(items)
let activeItems = []

function makeNextGetter(arr) {
  let lastIdx = 0

  return () => {
    if (lastIdx >= arr.length) lastIdx = 0

    return arr[lastIdx++]
  }
}

function hiddenOld() {
  activeItems.forEach(item => {
    item.classList.add('hidden')
  })
}

function doChange() {
  hiddenOld()
  change()
}

function isVideo(item) {
  return item.tagName === 'VIDEO'
}

function change() {
  if (items.length === 0) return

  activeItems = [nextItem(), nextItem()]

  const hasVideo = activeItems.some(isVideo)
  const isTwoVideos = activeItems.every(isVideo)

  activeItems.forEach((item, idx, arr) => {
    item.classList.remove('hidden')

    if (isVideo(item)) {
      const isLastItem = idx === arr.length - 1

      if (!(isTwoVideos && isLastItem)) {
        item.play()
      }

      item.onplay = () => {
        audio.muted = !item.muted
        item.onplay = null
      }

      item.onended = () => {
        if (isTwoVideos && !isLastItem) {
          arr[idx + 1].play()
        }

        item.onended = null

        if (!isTwoVideos || isLastItem) {
          audio.muted = false
          doChange()
        }
      }
    }
  })

  if (!hasVideo) {
    const timeoutId = setTimeout(() => {
      doChange()
      clearTimeout(timeoutId)
    }, 30000)
  }
}

change()
