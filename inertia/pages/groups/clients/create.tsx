import { Head, useForm } from '@inertiajs/react'
import { type FormEvent } from 'react'
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
import { Switch } from '~/components/switch'
import type { DefaultProps } from '~/type/props'
import { withComponent } from '~/utils/hoc'
import { Group as GroupData } from '~/type/group'

import styles from '../create.module.scss'

interface CreateProps {
  group: GroupData
}

const Create = ({ group }: DefaultProps<CreateProps>) => {
  const { data, setData, post, processing, errors, isDirty } = useForm({
    name: '',
    description: '',
    postTime: 30,
    audioUrl: '',
    hasSound: false,
    showNews: false,
    showGroupNews: false,
  })

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    post(`/groups/${group.id}/clients`)
  }

  return (
    <>
      <Head title="Criar Client" />
      <main className={styles.container}>
        <div>
          <BackLink href="/" />
          <h2>Criar cliente para o grupo {group.name}</h2>
          <Form onSubmit={handleSubmit} validationErrors={errors}>
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
              <Label>Posts até</Label>
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
              onChange={(v) => setData('showNews', v)}
              isDisabled={processing}
            >
              Exibir notícias
            </Switch>
            <Switch
              name="showGroupNews"
              isSelected={data.showGroupNews}
              onChange={(v) => setData('showGroupNews', v)}
              isDisabled={processing}
            >
              Exibir notícias do grupo
            </Switch>
            <Button type="submit" isDisabled={!isDirty || processing}>
              Enviar
            </Button>
          </Form>
        </div>
      </main>
    </>
  )
}

export default withComponent(Create, Dashboard)
