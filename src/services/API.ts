import { AccessAuth } from '../types/AccessAuth'
import { Cookie } from '../types/Cookie'

export async function authenticateClient(): Promise<AccessAuth> {
  const response = await fetch('https://www.reddit.com/api/v1/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${process.env.AUTHENTICATION_KEY}`
    },
    body: new URLSearchParams({
      'grant_type': 'client_credentials',
      'device_id': 'DO_NOT_TRACK_THIS_DEVICE'
    })
  })
  const accessAuth = <AccessAuth>await response.json()

  return accessAuth
}

function setHeaders(accessAuthString?: string): Headers {
  const accessToken = accessAuthString ? (<AccessAuth>JSON.parse(accessAuthString)).access_token : null
  const headers = new Headers({
    'Authorization': `Bearer ${accessToken}`
  })

  return headers
}

export async function fetchData<T>(request: RequestInfo, accessAuthString?: string): Promise<T> {
  const response = await fetch(request, {
    headers: setHeaders(accessAuthString)
  })
  const data = <T>await response.json()

  return data
}

export function parseCookie(): Cookie {
  const cookie = Object.fromEntries(document.cookie.split(/; */).map((c) => {
    const [key, ...v] = c.split('=')

    return [key, decodeURIComponent(v.join('='))]
  })) as Cookie

  return cookie
}
