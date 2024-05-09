import { Head, useForm } from '@inertiajs/react'
import { type FormEvent } from 'react'
import { Button, FieldError, Form, Input, Label, TextField } from 'react-aria-components'
import { BackLink } from '~/components/back_link'
import { Dashboard } from '~/components/dashboard'
import { withComponent } from '~/utils/hoc'

import styles from './create.module.scss'

const Create = () => {
  const { data, setData, post, processing, errors, isDirty } = useForm({
    username: '',
    password: '',
  })

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    post('/users')
  }

  return (
    <>
      <Head title="Criar Usuário" />
      <main className={styles.container}>
        <div>
          <BackLink href="/" />
          <h1>Criar usuário</h1>
          <Form onSubmit={handleSubmit} validationErrors={errors}>
            <TextField
              name="username"
              value={data.username}
              onChange={(v) => setData('username', v)}
              isRequired
              isDisabled={processing}
              maxLength={55}
            >
              <Label>Nome do usuário*</Label>
              <Input autoComplete="username" />
              <FieldError />
            </TextField>
            <TextField
              name="password"
              type="password"
              value={data.password}
              onChange={(v) => setData('password', v)}
              isRequired
              isDisabled={processing}
            >
              <Label>Senha*</Label>
              <Input autoComplete="new-password" />
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
