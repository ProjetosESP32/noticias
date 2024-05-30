import { Head, router } from '@inertiajs/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { Client } from '~/type/client'
import type { FileAttachment } from '~/type/file'
import type { DefaultProps } from '~/type/props'

import styles from './show.module.scss'

interface NewsData {
  id: number
  data: string
}

type FileAttachmentData = Omit<FileAttachment, 'groupId' | 'clientId' | 'createdAt' | 'updatedAt'>

interface ShowProps {
  client: Client
  news: NewsData[]
  files: FileAttachmentData[]
}

const Show = ({ client, files, news, nonce }: DefaultProps<ShowProps>) => {
  const audioRef = useRef<HTMLAudioElement>(null)

  const instagramFiles = files.filter((f) => f.isImported)
  const localFiles = files.filter((f) => !f.isImported)

  const showNews = client.showNews && news.length > 0

  const onVideoStart = (muted: boolean) => {
    if (audioRef.current && !muted) {
      audioRef.current.volume = 0.05
    }
  }

  const onVideoEnd = () => {
    if (audioRef.current) {
      audioRef.current.volume = 1
    }
  }

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
      {client.hasSound && client.audioUrl ? (
        <audio ref={audioRef} hidden src={client.audioUrl} autoPlay nonce={nonce} />
      ) : null}
      <main className={styles.container}>
        <FilesViewer
          onPlayVideo={onVideoStart}
          onVideoEnded={onVideoEnd}
          instagramFiles={instagramFiles}
          localFiles={localFiles}
          full={!showNews}
          time={client.postTime}
        />
        {showNews ? <NewsVignette news={news} /> : null}
      </main>
    </>
  )
}

interface FilesViewerProps {
  instagramFiles: FileAttachmentData[]
  localFiles: FileAttachmentData[]
  full?: boolean
  time?: number
  onPlayVideo?: (muted: boolean) => void
  onVideoEnded?: () => void
}

const noop = () => {}

const defaultUpdate = (
  ref: React.MutableRefObject<number>,
  files: FileAttachmentData[],
  update: (file: FileAttachmentData) => void
) => {
  ref.current = (ref.current + 1) % files.length
  update(files[ref.current])
}

const FilesViewer = ({
  instagramFiles,
  localFiles,
  full,
  time,
  onPlayVideo,
  onVideoEnded,
}: FilesViewerProps) => {
  const instagramPosRef = useRef(0)
  const localPosRef = useRef(0)
  const [instagramFile, setInstagramFile] = useState<FileAttachmentData>(instagramFiles[0])
  const [localFile, setLocalFile] = useState<FileAttachmentData>(localFiles[0])

  const instagramImageEnd = () => {
    defaultUpdate(instagramPosRef, instagramFiles, setInstagramFile)
  }

  const instagramVideoEnd = () => {
    instagramImageEnd()
    onVideoEnded?.()
  }

  const localImageEnd = () => {
    defaultUpdate(localPosRef, localFiles, setLocalFile)
  }

  const localVideoEnd = () => {
    localImageEnd()
    onVideoEnded?.()
  }

  return (
    <div className={styles.filesContainer} data-full={full}>
      {instagramFiles.length > 0 ? (
        <FileItem
          file={instagramFile}
          muted
          onPlayVideo={onPlayVideo}
          onImageEnd={instagramImageEnd}
          onVideoEnd={instagramVideoEnd}
          imageTime={time}
        />
      ) : (
        <div />
      )}
      {localFiles.length > 0 ? (
        <FileItem
          file={localFile}
          onPlayVideo={onPlayVideo}
          onImageEnd={localImageEnd}
          onVideoEnd={localVideoEnd}
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
  onPlay?: (muted: boolean) => void
  onEnded?: () => void
}

const Video = ({ src, mime, muted, onPlay, onEnded }: VideoProps) => {
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
      .catch((e) => {
        console.warn('cannot play video', e)
        onEnded?.()
      })
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

    onEnded?.()
  }

  useEffect(() => {
    videoRef.current?.load()
    playVideo()

    return () => {
      if (timeoutId.current !== null) {
        clearInterval(timeoutId.current)
        timeoutId.current = null
      }
    }
  }, [src])

  return (
    <video
      ref={videoRef}
      muted={muted}
      onPlay={() => onPlay?.(Boolean(muted))}
      onEnded={onVideoEnd}
    >
      <source src={src} type={mime} />
    </video>
  )
}

interface ImageProps {
  id: number
  src: string
  onTimeout?: () => void
  time?: number
}

const Image = ({ id, src, onTimeout = noop, time = 30 }: ImageProps) => {
  const timeoutTime = time * 1000

  useEffect(() => {
    const timeoutId = setTimeout(onTimeout, timeoutTime)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [onTimeout, timeoutTime])

  return <img src={src} alt={`Imagem de exibição id ${id}`} />
}

interface FileItemProps {
  file: FileAttachmentData
  muted?: boolean
  onPlayVideo?: (muted: boolean) => void
  onVideoEnd?: () => void
  onImageEnd?: () => void
  imageTime?: number
}

const FileItem = ({
  file,
  muted,
  onPlayVideo,
  onVideoEnd,
  onImageEnd,
  imageTime,
}: FileItemProps) => {
  const srcUrl = `/uploads/${file.file}`

  if (file.mime.includes('video')) {
    return (
      <Video
        src={srcUrl}
        mime={file.mime}
        muted={muted || !file.hasAudio}
        onPlay={onPlayVideo}
        onEnded={onVideoEnd}
      />
    )
  }

  return <Image id={file.id} onTimeout={onImageEnd} src={srcUrl} time={imageTime} />
}

export default Show
