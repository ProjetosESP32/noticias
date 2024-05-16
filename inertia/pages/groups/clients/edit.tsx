import { Head, useForm } from '@inertiajs/react'
import {
  Button,
  FieldError,
  Form,
  Group,
  Input,
  Label,
  NumberField,
  Text,
  TextField,
} from 'react-aria-components'
import { BackLink } from '~/components/back_link'
import { Dashboard } from '~/components/dashboard'
import { FileDialog, FileList } from '~/components/file'
import { NewsForm, NewsList } from '~/components/news'
import { Switch } from '~/components/switch'
import type { FullClient } from '~/type/client'
import type { DefaultProps } from '~/type/props'
import { withComponent } from '~/utils/hoc'

import styles from './edit.module.scss'

interface EditProps {
  client: FullClient
}

const Edit = ({ client }: DefaultProps<EditProps>) => (
  <>
    <Head title={`Editar ${client.name}`} />
    <main className="full">
      <div className={styles.content}>
        <BackLink href={`/groups/${client.groupId}`} />
        <h2>Atualizar o cliente {client.name}</h2>
        <p>Grupo: {client.relatedGroup.name}</p>
        <ClientForm client={client} />

        {client.showNews ? (
          <article className={styles.newsArticle}>
            <h3>Notícias para este cliente</h3>
            <NewsList
              news={client.news}
              getDeleteHref={(newsItem) =>
                `/groups/${newsItem.groupId}/clients/${newsItem.clientId}/news/${newsItem.id}`
              }
            />
            <section>
              <h4>Adicionar notícia</h4>
              <NewsForm postHref={`/groups/${client.groupId}/clients/${client.id}/news`} />
            </section>
          </article>
        ) : null}

        <article className={styles.fileArticle}>
          <h3>Arquivos deste cliente</h3>
          <section>
            <FileDialog postHref={`/groups/${client.groupId}/clients/${client.id}/files`} />
          </section>
          <FileList
            files={client.files}
            getDeleteHref={(file) =>
              `/groups/${file.groupId}/clients/${file.clientId}/files/${file.id}`
            }
          />
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

export default withComponent(Edit, Dashboard)
