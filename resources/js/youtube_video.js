import 'youtube-video-js'

import '../css/youtube_video.css'

/**
 * @type {HTMLElement}
 */
const video = document.querySelector('youtube-video')

const resize = () => {
  video.setAttribute('width', innerWidth)
  video.setAttribute('height', innerHeight)
}

addEventListener('resize', resize)
resize()
