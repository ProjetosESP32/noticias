import Logger from '@ioc:Adonis/Core/Logger'
import News from 'App/Models/News'
import axios from 'axios'
import { JSDOM } from 'jsdom'
import { DateTime } from 'luxon'

const throwIfHasRejected = <T>(data: Array<PromiseSettledResult<T>>) => {
  const hasErrors = data.some(({ status }) => status === 'rejected')

  if (hasErrors) {
    const rejectedItems = data.filter(({ status }) => status === 'rejected') as PromiseRejectedResult[]
    const reasons = rejectedItems.map(({ reason }) => reason.message).join('\n')

    throw new Error(reasons)
  }
}

const loadNews = async () => {
  Logger.debug('Getting news')
  const { data } = await axios.get('https://cba.ifmt.edu.br/conteudo/noticias/', { headers: { Accept: 'text/html' } })
  const dom = new JSDOM(data)
  const news = Array.from(dom.window.document.querySelectorAll('div.small-12.columns.borda-esquerda'))
    .map(el => ({
      date: el.children.item(0)?.textContent ?? '',
      news: el.children.item(1)?.textContent ?? '',
    }))
    .filter(({ date }) => {
      const [datePart] = date.split('-')
      const trimmedDate = datePart.trim()
      const pastDays = DateTime.fromFormat(trimmedDate, 'dd MMM', { locale: 'pt-br' }).diffNow().as('days')

      return pastDays >= -5
    })
    .map(({ news: n }) => n.trim())

  await News.query().whereNull('news_session_id').delete()
  await News.createMany(news.map(description => ({ description })))

  Logger.debug('Getting news complete')
}

const loadInstagramPosts = async () => {
  Logger.debug('Getting instagram posts')

  throw new Error('Not implemented')

  // Logger.debug('Getting instagram posts complete')
}

export const loadData = async () => {
  Logger.debug('Starting loading all data')

  const settled = await Promise.allSettled([loadNews(), loadInstagramPosts()])
  throwIfHasRejected(settled)

  Logger.debug('All data loaded')
}
