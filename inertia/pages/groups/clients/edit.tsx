import { Head, Link, useForm } from '@inertiajs/react'
import {
  Button,
  Dialog,
  DialogTrigger,
  FieldError,
  FileTrigger,
  Form,
  Group,
  Heading,
  Input,
  Label,
  Modal,
  NumberField,
  Text,
  TextField,
} from 'react-aria-components'
import { Trash2 } from 'react-feather'
import { BackLink } from '~/components/back_link'
import { Dashboard } from '~/components/dashboard'
import { Switch } from '~/components/switch'
import type { FullClient } from '~/type/client'
import type { FileAttachment } from '~/type/file'
import type { News } from '~/type/news'
import type { DefaultProps } from '~/type/props'
import { withComponent } from '~/utils/hoc'

import styles from './edit.module.scss'

interface EditProps {
  client: FullClient
}

const Edit = ({ client }: DefaultProps<EditProps>) => (
  <>
    <Head title={`Editar ${client.name}`} />
    <main className={styles.container}>
      <div className={styles.content}>
        <BackLink href={`/groups/${client.groupId}`} />
        <h2>Atualizar o cliente {client.name}</h2>
        <h3>Grupo: {client.relatedGroup.name}</h3>
        <ClientForm client={client} />

        {client.showNews ? (
          <article>
            <h3>Notícias para este cliente</h3>
            <NewsList news={client.news} />
            <section>
              <h4>Adicionar notícia</h4>
              <NewsForm clientId={client.id} groupId={client.groupId} />
            </section>
          </article>
        ) : null}

        <article>
          <h3>Arquivos deste cliente</h3>
          <section>
            <h4>Adicionar arquivos</h4>
            <FileDialog clientId={client.id} groupId={client.groupId} />
          </section>
          <FileList files={client.files} />
        </article>
      </div>
    </main>
  </>
)

const ClientForm = ({ client }: EditProps) => {
  const { data, setData, put, processing, errors, isDirty } = useForm({
    name: client.name,
    description: client.description,
    postTime: client.postTime,
    audioUrl: client.audioUrl ?? '',
    hasSound: client.hasSound,
    showNews: client.showNews,
    showGroupNews: client.showGroupNews,
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    put(`/groups/${client.groupId}/clients/${client.id}`)
  }

  return (
    <Form className={styles.form} onSubmit={handleSubmit} validationErrors={errors}>
      <TextField
        name="name"
        value={data.name}
        onChange={(v) => setData('name', v)}
        isRequired
        isDisabled={processing}
        maxLength={25}
      >
        <Label>Nome do cliente*</Label>
        <Input />
        <Text slot="description">O cliente é a sessão de exibição, ou a TV.</Text>
        <FieldError />
      </TextField>
      <TextField
        name="description"
        value={data.description}
        onChange={(v) => setData('description', v)}
        isRequired
        isDisabled={processing}
        maxLength={100}
      >
        <Label>Descrição*</Label>
        <Input />
        <Text slot="description">Ex: TV do departamento x.</Text>
        <FieldError />
      </TextField>
      <NumberField
        name="postTime"
        value={data.postTime}
        onChange={(v) => setData('postTime', v)}
        minValue={1}
        maxValue={300}
      >
        <Label>Tempo das imagens</Label>
        <Group>
          <Button slot="decrement">-</Button>
          <Input />
          <Button slot="increment">+</Button>
        </Group>
        <Text slot="description">Tempo das imagens na exibição em segundos.</Text>
        <FieldError />
      </NumberField>
      <TextField
        name="audioUrl"
        value={data.audioUrl}
        onChange={(v) => setData('audioUrl', v)}
        isDisabled={processing}
      >
        <Label>URL do áudio</Label>
        <Input />
        <FieldError />
      </TextField>
      <Switch
        name="hasSound"
        isSelected={data.hasSound}
        onChange={(v) => setData('hasSound', v)}
        isDisabled={processing}
      >
        Terá áudio
      </Switch>
      <Switch
        name="showNews"
        isSelected={data.showNews}
        onChange={(v) =>
          setData((old) => ({ ...old, showNews: v, showGroupNews: !v ? false : old.showGroupNews }))
        }
        isDisabled={processing}
      >
        Exibir notícias
      </Switch>
      <Switch
        name="showGroupNews"
        isSelected={data.showGroupNews}
        onChange={(v) =>
          setData((old) => ({ ...old, showGroupNews: v, showNews: v ? true : old.showNews }))
        }
        isDisabled={processing}
      >
        Exibir notícias do grupo
      </Switch>
      <Button type="submit" isDisabled={!isDirty || processing}>
        Atualizar dados do cliente
      </Button>
    </Form>
  )
}

const NewsList = ({ news }: { news: News[] }) => (
  <ol>
    {news.map((newsItem) => (
      <li key={newsItem.id}>{newsItem.data}</li>
    ))}
  </ol>
)

const NewsForm = ({ clientId, groupId }: { groupId: number; clientId: number }) => {
  const { data, setData, post, processing, errors, isDirty } = useForm({
    data: '',
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    post(`/groups/${groupId}/clients/${clientId}/news`, {
      onSuccess: () => {
        setData('data', '')
      },
    })
  }

  return (
    <Form className={styles.form} onSubmit={handleSubmit} validationErrors={errors}>
      <TextField
        name="name"
        value={data.data}
        onChange={(v) => setData('data', v)}
        isRequired
        isDisabled={processing}
      >
        <Label>Texto da notícia*</Label>
        <Input />
        <FieldError />
      </TextField>
      <Button type="submit" isDisabled={!isDirty || processing}>
        Adicionar notícia
      </Button>
    </Form>
  )
}

const FileItem = ({ file }: { file: FileAttachment }) => {
  const isImage = file.mime.includes('image')
  const removeButton = (
    <Link
      href={`/groups/${file.groupId}/clients/${file.clientId}/files/${file.id}`}
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

const FileList = ({ files }: { files: FileAttachment[] }) => (
  <ul className={styles.fileList}>
    {files.map((file) => (
      <FileItem key={file.id} file={file} />
    ))}
  </ul>
)

interface FileFormProps {
  onSend: () => void
  groupId: number
  clientId: number
}

interface FileFormState {
  file: File | null
  hasAudio: boolean
  hasPriority: boolean
}

const FileForm = ({ clientId, groupId, onSend }: FileFormProps) => {
  const { data, setData, post, errors, processing, isDirty } = useForm<FileFormState>({
    file: null,
    hasAudio: false,
    hasPriority: false,
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    post(`/groups/${groupId}/clients/${clientId}/files`, { forceFormData: true, onFinish: onSend })
  }

  return (
    <Form onSubmit={handleSubmit} validationErrors={errors}>
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
        <Button>Selecionar arquivos</Button>
      </FileTrigger>
      {data.file !== null ? (
        <>
          <p>Arquivo selecionado: {data.file.name}</p>
          <p>{data.file.size} bytes</p>
        </>
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

const FileDialog = ({ clientId, groupId }: Omit<FileFormProps, 'onSend'>) => {
  return (
    <DialogTrigger>
      <Button>Adicionar arquivos</Button>
      <Modal>
        <Dialog>
          {({ close }) => (
            <div>
              <Heading slot="title">Adicione os arquivos</Heading>
              <FileForm clientId={clientId} groupId={groupId} onSend={close} />
              <Button onPress={close}>Fechar</Button>
            </div>
          )}
        </Dialog>
      </Modal>
    </DialogTrigger>
  )
}

export default withComponent(Edit, Dashboard)
