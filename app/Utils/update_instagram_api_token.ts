import NewsGroup from 'App/Models/NewsGroup'
import axios from 'axios'

interface InstagramAPIUpdateTokenResponse {
  access_token: string
  token_type: string
  expires_in: number
}

export const updateInstagramApiToken = async () => {
  const newsGroups = await NewsGroup.query().whereNotNull('instagram_token')

  const promises = newsGroups.map(async group => {
    const { data } = await axios.get<InstagramAPIUpdateTokenResponse>(
      'https://graph.instagram.com/refresh_access_token',
      {
        params: {
          grant_type: 'ig_refresh_token',
          access_token: group.instagramToken,
        },
      },
    )

    group.merge({ instagramToken: data.access_token })
    await group.save()
  })

  const settled = await Promise.allSettled(promises)
  const hasRejections = settled.some(({ status }) => status === 'rejected')

  if (hasRejections) {
    const rejected = settled.filter(({ status }) => status === 'rejected') as PromiseRejectedResult[]
    const message = rejected.reduce((acc, { reason }) => `${acc}\n${String(reason)}`, '')

    throw new Error(`Update rejected: ${message}`)
  }
}
