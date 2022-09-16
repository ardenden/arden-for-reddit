import { createContext, ReactNode, useEffect, useState } from 'react'
import { parseCookie } from '../services/API'
import { Cookie } from '../types/Cookie'

type Props = {
  children: ReactNode
}

const CookieContext = createContext<Cookie | undefined>(undefined)

function CookieContextProvider({ children }: Props) {
  const [cookie, setCookie] = useState<Cookie>()

  useEffect(() => {
    if (!cookie) {
      setCookie(parseCookie())
    }
  }, [])

  return (
    <CookieContext.Provider value={cookie}>
      {children}
    </CookieContext.Provider>
  )
}

export {
  CookieContext,
  CookieContextProvider
}
