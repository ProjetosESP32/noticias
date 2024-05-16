import { Head, Link, useForm } from '@inertiajs/react'
import { type FormEvent } from 'react'
import { Button, FieldError, Form, Input, Label, TextField } from 'react-aria-components'
import { Switch } from '~/components/switch'

import styles from './login.module.scss'

const Login = () => {
  const { data, setData, post, processing, errors } = useForm({
    username: '',
    password: '',
    rememberMe: true,
  })

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    post('/auth')
  }

  return (
    <>
      <Head title="Login" />
      <main className={styles.container}>
        <Form onSubmit={handleSubmit} validationErrors={errors}>
          <h1>Login</h1>
          <TextField
            name="username"
            value={data.username}
            onChange={(v) => setData('username', v)}
            isRequired
            isDisabled={processing}
          >
            <Label>Nome de usuário*</Label>
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
            <Input autoComplete="current-password" />
            <FieldError />
          </TextField>
          <Switch
            name="rememberMe"
            isSelected={data.rememberMe}
            onChange={(v) => setData('rememberMe', v)}
            isDisabled={processing}
          >
            Lembrar-me
          </Switch>
          <Button type="submit">Enviar</Button>
          <p>Não é isso que deseja?</p>
          <Link href="/clients">Selecionar cliente de exibição.</Link>
        </Form>
      </main>
    </>
  )
}

export default Login
