import { Head, useForm } from '@inertiajs/react'
import { type FormEvent } from 'react'
import { Button, FieldError, Form, Input, Label, Text, TextField } from 'react-aria-components'
import { BackLink } from '~/components/back_link'
import { Dashboard } from '~/components/dashboard'
import { Switch } from '~/components/switch'
import type { Group } from '~/type/group'
import { withComponent } from '~/utils/hoc'
import type { DefaultProps } from '~/utils/props'

import styles from '../create.module.scss'

interface CreateProps {
  group: Group
}

const Create = ({ group }: DefaultProps<CreateProps>) => {
  const { data, setData, post, processing, errors, isDirty } = useForm({
    name: '',
    description: '',
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
          <h1>Criar cliente para o grupo {group.name}</h1>
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
              <Label>Descrição</Label>
              <Input />
              <Text slot="description">Ex: TV do departamento x.</Text>
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
