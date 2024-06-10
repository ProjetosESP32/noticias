import { Link, useForm } from '@inertiajs/react'
import {
  Button,
  Dialog,
  DialogTrigger,
  FileTrigger,
  Form,
  Heading,
  Modal,
} from 'react-aria-components'
import { Trash2, X } from 'react-feather'
import { FileAttachment } from '~/type/file'
import { Switch } from './switch'

import styles from './file.module.scss'

interface FileItemProps {
  file: FileAttachment
  deleteHref: string
}

const FileItem = ({ file, deleteHref }: FileItemProps) => {
  const isImage = file.mime.includes('image')
  const removeButton = (
    <Link
      href={deleteHref}
      method="delete"
      as="button"
      type="button"
      title={`Remover ${isImage ? 'imagem' : 'vídeo'}`}
    >
      <Trash2 size={16} />
    </Link>
  )

  const fileSource = `/uploads/${file.file}`

  if (isImage) {
    return (
      <li>
        <img
          src={fileSource}
          alt={`arquivo de imagem com id ${file.id}`}
          data-priority={file.hasPriority}
        />
        {removeButton}
      </li>
    )
  }

  return (
    <li>
      <video controls muted={!file.hasAudio} data-priority={file.hasPriority}>
        <source src={fileSource} type={file.mime} />
      </video>
      {removeButton}
    </li>
  )
}

interface FileListProps {
  files: FileAttachment[]
  getDeleteHref: (file: FileAttachment) => string
}

export const FileList = ({ files, getDeleteHref }: FileListProps) => (
  <ul className={styles.fileList}>
    {files.map((file) => (
      <FileItem key={file.id} file={file} deleteHref={getDeleteHref(file)} />
    ))}
  </ul>
)

interface FileFormProps {
  onSend: () => void
  postHref: string
}

interface FileFormState {
  file: File | null
  hasAudio: boolean
  hasPriority: boolean
}

const FileForm = ({ onSend, postHref }: FileFormProps) => {
  const { data, setData, post, errors, processing, isDirty } = useForm<FileFormState>({
    file: null,
    hasAudio: false,
    hasPriority: false,
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    post(postHref, { forceFormData: true, onFinish: onSend })
  }

  return (
    <Form className={styles.fileForm} onSubmit={handleSubmit} validationErrors={errors}>
      <FileTrigger
        acceptedFileTypes={['image/png', 'image/jpg', 'image/jpeg', 'video/mp4']}
        onSelect={(fileList) => {
          if (fileList) {
            const file = fileList.item(0)
            if (file) {
              setData('file', file)
            }
          }
        }}
      >
        <Button>Selecionar arquivo</Button>
      </FileTrigger>
      {data.file !== null ? (
        <div className={styles.fileData}>
          <p>Arquivo selecionado: {data.file.name}</p>
          <p>{data.file.size} bytes</p>
        </div>
      ) : null}
      <Switch
        name="hasAudio"
        isSelected={data.hasAudio}
        isDisabled={processing}
        onChange={(v) => setData('hasAudio', v)}
      >
        Se vídeo, terá audio.
      </Switch>
      <Switch
        name="hasPriority"
        isSelected={data.hasPriority}
        isDisabled={processing}
        onChange={(v) => setData('hasPriority', v)}
      >
        Arquivo terá prioridade.
      </Switch>
      <Button type="submit" isDisabled={!isDirty || processing}>
        Enviar
      </Button>
    </Form>
  )
}

export const FileDialog = ({ postHref }: Omit<FileFormProps, 'onSend'>) => (
  <DialogTrigger>
    <Button>Adicionar arquivo</Button>
    <Modal>
      <Dialog>
        {({ close }) => (
          <div className={styles.fileModalContent}>
            <Button className={styles.closeModal} aria-label="Fechar modal" onPress={close}>
              <X size={24} />
            </Button>
            <Heading className={styles.heading} slot="title">
              Adicione o arquivo
            </Heading>
            <FileForm postHref={postHref} onSend={close} />
          </div>
        )}
      </Dialog>
    </Modal>
  </DialogTrigger>
)
