import { CronJob } from 'cron'
import axios from 'axios'
import { JSDOM } from 'jsdom'
import PortalNews from 'App/Models/PortalNews'
import Logger from '@ioc:Adonis/Core/Logger'

void new CronJob(
  '0 6,12,18 * * *',
  () => {
    void (async () => {
      try {
        Logger.info('Job started')
        const { data } = await axios.get('https://cba.ifmt.edu.br/conteudo/noticias/')
        const dom = new JSDOM(data)
        const newsElements = Array.from(dom.window.document.querySelectorAll('p.no-margin.espacamento-medio'))
        const news = newsElements.map(el => el.textContent).filter(el => typeof el === 'string') as string[]

        await PortalNews.query().delete().whereNotIn('description', news)
        await PortalNews.fetchOrCreateMany(
          ['description'],
          news.map(description => ({ description })),
        )
        Logger.info('Job complete')
      } catch (e) {
        Logger.error(e, 'Error in job')
      }
    })()
  },
  null,
  true,
  'America/Cuiaba',
)
