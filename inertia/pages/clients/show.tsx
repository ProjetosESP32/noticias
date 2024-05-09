import { Head } from '@inertiajs/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { FullClient } from '~/type/client'
import type { FileAttachment } from '~/type/file'

import styles from './show.module.scss'
import { News } from '~/type/news'

interface ShowProps {
  client: FullClient
}

const Show = ({ client }: ShowProps) => {
  const files = [...client.files, ...client.relatedGroup.files]
  const news = [...client.news, ...(client.showGroupNews ? client.relatedGroup.news : [])]

  return (
    <>
      <Head title={client.name} />
      <main className={styles.container}>
        <FilesViewer files={files} full={!client.showNews} muted={!client.hasSound} />
        {client.showNews ? <NewsVignette news={news} /> : null}
      </main>
    </>
  )
}

interface FilesViewerProps {
  files: FileAttachment[]
  full?: boolean
  muted?: boolean
}

const noop = () => {}

const FilesViewer = ({ files, full, muted }: FilesViewerProps) => {
  const posRef = useRef(1)
  const [fileIndexes, setFileIndexes] = useState<[number, number]>([0, 1])
  const firstFile = files[fileIndexes[0]]
  const secondFile = files[fileIndexes[1]]

  const getNextIndex = () => {
    posRef.current = (posRef.current + 1) % files.length
    return posRef.current
  }

  const makeEnded = (panelIndex: 0 | 1) => {
    if (files.length <= 2) {
      return noop
    }

    return () => {
      const newFileIndexes = structuredClone<[number, number]>(fileIndexes)
      newFileIndexes[panelIndex] = getNextIndex()
      setFileIndexes(newFileIndexes)
    }
  }

  return (
    <div className={styles.filesContainer} data-full={full}>
      <FileItem file={firstFile} muted={muted} onEnded={makeEnded(0)} />
      <FileItem file={secondFile} muted={muted} onEnded={makeEnded(1)} />
    </div>
  )
}

const NewsVignette = ({ news }: { news: News[] }) => {
  const makeContent = (tag: string) => (
    <div className={styles.scrollContent} style={{ animationDuration: `${15 * news.length}s` }}>
      {news.map(({ id, data }) => (
        <span key={`${tag}-${id}`}>{data}</span>
      ))}
    </div>
  )

  return (
    <div className={styles.scrollContainer}>
      {makeContent('t1')}
      {makeContent('t2')}
    </div>
  )
}

interface VideoProps {
  src: string
  mime: string
  muted?: boolean
  onEnded: () => void
}

const Video = ({ src, mime, muted, onEnded }: VideoProps) => {
  const isPlaying = useRef(false)
  const timeoutId = useRef<number | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const playVideo = useCallback(() => {
    if (isPlaying.current) {
      return
    }

    videoRef.current
      ?.play()
      .then(() => {
        isPlaying.current = true
      })
      .catch((e) => console.warn('cannot play video', e))
  }, [])

  const onVideoEnd = () => {
    isPlaying.current = false
    if (timeoutId.current !== null) {
      clearTimeout(timeoutId.current)
    }

    timeoutId.current = setTimeout(() => {
      playVideo()
    }, 1000)

    onEnded()
  }

  useEffect(() => {
    playVideo()

    return () => {
      if (timeoutId.current !== null) {
        clearInterval(timeoutId.current)
      }
    }
  }, [playVideo])

  return (
    <video ref={videoRef} muted={muted} onEnded={onVideoEnd}>
      <source src={src} type={mime} />
    </video>
  )
}

interface ImageProps {
  id: number
  src: string
  onEnded: () => void
  time?: number
}

const Image = ({ id, src, onEnded, time = 30000 }: ImageProps) => {
  useEffect(() => {
    const timeoutId = setTimeout(onEnded, time)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [onEnded, time])

  return <img src={src} alt={`Imagem de exibição id ${id}`} />
}

interface FileItemProps {
  file: FileAttachment
  muted?: boolean
  onEnded: () => void
  imageTime?: number
}

const FileItem = ({ file, muted, onEnded, imageTime }: FileItemProps) => {
  const srcUrl = `/uploads/${file.file}`

  if (file.mime.includes('video')) {
    return <Video src={srcUrl} mime={file.mime} muted={muted} onEnded={onEnded} />
  }

  return <Image id={file.id} onEnded={onEnded} src={srcUrl} time={imageTime} />
}

export default Show
