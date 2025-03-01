import axios from 'axios'

const clientId = import.meta.env.VITE_DISCORD_CLIENT_ID
const clientSecret = import.meta.env.VITE_DISCORD_CLIENT_SECRET
const redirectUri = import.meta.env.VITE_DISCORD_REDIRECT_URI

export const getAccessToken = async (code: string) => {
  const url = 'https://discord.com/api/oauth2/token'
  const data = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri,
  })

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
  }

  const response = await axios.post(url, data, { headers })
  return response.data
}

export const getDiscordUser = async (access_token: string) => {
  const response = await axios.get('https://discord.com/api/users/@me', {
    headers: { Authorization: `Bearer ${access_token}` },
  })
  if (!response) throw new Error('Không thể lấy thông tin user')
  return response.data
}
