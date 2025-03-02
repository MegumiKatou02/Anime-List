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

export const getDiscordUser = async (access_token: string | null) => {
  const response = await axios.get('https://discord.com/api/users/@me', {
    headers: { Authorization: `Bearer ${access_token}` },
  })
  if (!response) throw new Error('Không thể lấy thông tin user')
  return response.data
}

export const refreshToken = async () => {
  const refresh_token = localStorage.getItem('refresh_token') || ''
  if (!refresh_token) {
    console.error('Không có refresh token!')
    return null
  }

  try {
    const response = await axios.post(`https://discord.com/api/oauth2/token`, {
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'refresh_token',
      refresh_token,
    })

    const { access_token, expires_in, refresh_token: new_refresh_token } = response.data

    localStorage.setItem('discord_token', access_token)
    localStorage.setItem('refresh_token', new_refresh_token)
    localStorage.setItem('token_expiry', (Date.now() + expires_in * 1000).toString())

    return access_token
  } catch (error) {
    console.error('Lỗi refresh token:', error)
    return null
  }
}

export const checkToken = async (token: string | null): Promise<boolean> => {
  if (!token) {
    return false
  }
  try {
    const response = await axios.get('https://discord.com/api/v10/users/@me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.status === 200) {
      return true
    }
  } catch (error) {
    console.error('Error while checking token:', error)
  }

  return false
}
