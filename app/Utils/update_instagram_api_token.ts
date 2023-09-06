import AppConfig from 'App/Models/AppConfig'
import axios from 'axios'

interface InstagramAPIUpdateTokenResponse {
  access_token: string
  token_type: string
  expires_in: number
}

export const updateInstagramApiToken = async () => {
  const apiConfig = await AppConfig.findByOrFail('key', 'instagram_token')

  const { data } = await axios.get<InstagramAPIUpdateTokenResponse>(
    'https://graph.instagram.com/refresh_access_token',
    {
      params: {
        grant_type: 'ig_refresh_token',
        access_token: apiConfig.value,
      },
    },
  )

  apiConfig.merge({ value: data.access_token })
  await apiConfig.save()
}
