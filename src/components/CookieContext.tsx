import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { parseCookie } from '../services/API'
import { Cookie } from '../types/Cookie'

type Props = {
  children: ReactNode
}

const CookieContext = createContext<Cookie | undefined>(undefined)
const useCookie = () => useContext(CookieContext)

function CookieProvider({ children }: Props) {
  const [cookie, setCookie] = useState<Cookie>()

  useEffect(() => {
    if (!cookie) {
      setCookie(parseCookie(document.cookie))
    }
  }, [])

  return (
    <CookieContext.Provider value={cookie}>
      {children}
    </CookieContext.Provider>
  )
}

export {
  CookieProvider,
  useCookie
}
