import { Link, useForm } from '@inertiajs/react'
import { Button, FieldError, Form, Input, Label, TextField } from 'react-aria-components'
import { Trash } from 'react-feather'
import type { News } from '~/type/news'

import styles from './news.module.scss'

interface NewsListProps {
  news: News[]
  getDeleteHref: (news: News) => string
}

export const NewsList = ({ news, getDeleteHref }: NewsListProps) => (
  <ol className={styles.newsList}>
    {news.map((newsItem) => (
      <li key={newsItem.id}>
        <span>
          {newsItem.data}{' '}
          <Link
            href={getDeleteHref(newsItem)}
            method="delete"
            as="button"
            type="button"
            title="Excluir notícia"
          >
            <Trash size={18} />
          </Link>
        </span>
      </li>
    ))}
  </ol>
)

interface NewsFormProps {
  postHref: string
}

export const NewsForm = ({ postHref }: NewsFormProps) => {
  const { data, setData, post, processing, errors, isDirty } = useForm({
    data: '',
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    post(postHref, {
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
