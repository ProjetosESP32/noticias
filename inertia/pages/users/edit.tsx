import { Head, useForm } from '@inertiajs/react'
import { type FormEvent } from 'react'
import { Button, FieldError, Form, Input, Label, TextField } from 'react-aria-components'
import { BackLink } from '~/components/back_link'
import { Dashboard } from '~/components/dashboard'
import type { User } from '~/type/user'
import { withComponent } from '~/utils/hoc'
import type { DefaultProps } from '~/type/props'

import styles from './create.module.scss'

interface EditProps {
  user: User
}

const Edit = ({ user }: DefaultProps<EditProps>) => {
  const { data, setData, put, processing, errors, isDirty } = useForm({
    username: user.username,
    oldPassword: '',
    newPassword: '',
  })

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    put(`/users/${user.id}`)
  }

  return (
    <>
      <Head title="Editar Usuário" />
      <main className={styles.container}>
        <div>
          <BackLink href="/" />
          <h1>Editar usuário {user.username}</h1>
          <Form onSubmit={handleSubmit} validationErrors={errors}>
            <TextField
              name="username"
              value={data.username}
              onChange={(v) => setData('username', v)}
              isRequired
              isDisabled={processing}
              maxLength={55}
            >
              <Label>Nome do usuário</Label>
              <Input autoComplete="username" />
              <FieldError />
            </TextField>
            <TextField
              name="oldPassword"
              type="password"
              value={data.oldPassword}
              onChange={(v) => setData('oldPassword', v)}
              isRequired
              isDisabled={processing}
            >
              <Label>Senha Atual</Label>
              <Input autoComplete="current-password" />
              <FieldError />
            </TextField>
            <TextField
              name="newPassword"
              type="password"
              value={data.newPassword}
              onChange={(v) => setData('newPassword', v)}
              isRequired
              isDisabled={processing}
            >
              <Label>Nova Senha</Label>
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

export default withComponent(Edit, Dashboard)
