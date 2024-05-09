import { Head, useForm } from '@inertiajs/react'
import { type FormEvent } from 'react'
import { Button, FieldError, Form, Input, Label, Text, TextField } from 'react-aria-components'
import { BackLink } from '~/components/back_link'
import { Dashboard } from '~/components/dashboard'
import { withComponent } from '~/utils/hoc'

import styles from './create.module.scss'

const Create = () => {
  const { data, setData, post, processing, errors, isDirty } = useForm({
    name: '',
    description: '',
    instagramToken: '',
    newsSource: '',
    newsSourceSelector: '',
  })

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    post('/groups')
  }

  return (
    <>
      <Head title="Criar Grupo" />
      <main className={styles.container}>
        <div>
          <BackLink href="/" />
          <h1>Criar grupo</h1>
          <Form onSubmit={handleSubmit} validationErrors={errors}>
            <TextField
              name="name"
              value={data.name}
              onChange={(v) => setData('name', v)}
              isRequired
              isDisabled={processing}
              maxLength={25}
            >
              <Label>Nome do grupo*</Label>
              <Input />
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
              <FieldError />
            </TextField>
            <TextField
              name="instagramToken"
              value={data.instagramToken}
              onChange={(v) => setData('instagramToken', v)}
              isDisabled={processing}
            >
              <Label>Token do Instagram</Label>
              <Input />
              <FieldError />
            </TextField>
            <TextField
              name="newsSource"
              value={data.newsSource}
              onChange={(v) => setData('newsSource', v)}
              isDisabled={processing}
            >
              <Label>Fonte das notícias</Label>
              <Input />
              <FieldError />
            </TextField>
            <TextField
              name="newsSourceSelector"
              value={data.newsSourceSelector}
              onChange={(v) => setData('newsSourceSelector', v)}
              isDisabled={processing}
            >
              <Label>Seletor de fonte das notícias</Label>
              <Input />
              <Text slot="description">
                Seletor do DOM para pegar os textos das notícias (o algorítmo usa{' '}
                <code>querySelectorAll</code> e pega o conteúdo pelo <code>textContent</code>)
              </Text>
              <FieldError />
            </TextField>
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
