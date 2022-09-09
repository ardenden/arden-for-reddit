import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { authenticateClient } from './services/API'

export async function middleware(request: NextRequest) {
  const cookie = request.cookies.get('access_auth')
  const response = NextResponse.next()

  if (!cookie) {
    const accessAuth = await authenticateClient()
    response.cookies.set('access_auth', JSON.stringify(accessAuth))
  }

  return response
}
