import { Head, router } from '@inertiajs/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { Client } from '~/type/client'
import type { FileAttachment } from '~/type/file'

import styles from './show.module.scss'

interface NewsData {
  id: number
  data: string
}

interface ShowProps {
  client: Client
  news: NewsData[]
  files: Omit<FileAttachment, 'groupId' | 'clientId' | 'createdAt' | 'updatedAt'>[]
}

const Show = ({ client, files, news }: ShowProps) => {
  const instagramFiles = files.filter((f) => f.isImported)
  const localFiles = files.filter((f) => !f.isImported)

  useEffect(() => {
    const tiemoutId = setInterval(
      () => {
        router.reload()
      },
      60 * 60 * 1000 // 1 hour
    )

    return () => {
      clearInterval(tiemoutId)
    }
  }, [])

  return (
    <>
      <Head title={client.name} />
      {client.audioUrl ? <audio hidden src={client.audioUrl} autoPlay /> : null}
      <main className={styles.container}>
        <FilesViewer
          instagramFiles={instagramFiles}
          localFiles={localFiles}
          full={!client.showNews}
          muted={!client.hasSound}
          time={client.postTime}
        />
        {client.showNews ? <NewsVignette news={news} /> : null}
      </main>
    </>
  )
}

interface FilesViewerProps {
  instagramFiles: FileData[]
  localFiles: FileData[]
  full?: boolean
  muted?: boolean
  time?: number
}

const noop = () => {}

const FilesViewer = ({ instagramFiles, localFiles, full, muted, time }: FilesViewerProps) => {
  const instagramPosRef = useRef(0)
  const localPosRef = useRef(0)
  const [instagramFile, setInstagramFile] = useState<FileData>(instagramFiles[0])
  const [localFile, setLocalFile] = useState<FileData>(localFiles[0])

  const makeEnded = (
    files: FileData[],
    ref: React.MutableRefObject<number>,
    update: React.Dispatch<React.SetStateAction<FileData>>
  ) => {
    if (files.length <= 2) {
      return noop
    }

    return () => {
      ref.current = (ref.current + 1) % files.length
      update(files[ref.current])
    }
  }

  return (
    <div className={styles.filesContainer} data-full={full}>
      {instagramFile ? (
        <FileItem
          file={instagramFile}
          muted
          onEnded={makeEnded(instagramFiles, instagramPosRef, setInstagramFile)}
          imageTime={time}
        />
      ) : (
        <div />
      )}
      {localFile ? (
        <FileItem
          file={localFile}
          muted={muted}
          onEnded={makeEnded(localFiles, localPosRef, setLocalFile)}
          imageTime={time}
        />
      ) : (
        <div />
      )}
    </div>
  )
}

const NewsVignette = ({ news }: { news: NewsData[] }) => {
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
      timeoutId.current = null
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
        timeoutId.current = null
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

const Image = ({ id, src, onEnded, time = 30 }: ImageProps) => {
  const timeoutTime = time * 1000

  useEffect(() => {
    const timeoutId = setTimeout(onEnded, timeoutTime)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [onEnded, timeoutTime])

  return <img src={src} alt={`Imagem de exibição id ${id}`} />
}

interface FileData {
  id: number
  mime: string
  file: string
}

interface FileItemProps {
  file: FileData
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
