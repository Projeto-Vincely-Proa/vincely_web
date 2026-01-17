import { createContext, useState } from 'react'

export const MenuContext = createContext(null)

export function MenuHamburguer({ children }) {
  const [aberto, setAberto] = useState(false)
  const toggle = () => setAberto(p => !p)

  return (
    <MenuContext.Provider value={{ aberto, toggle }}>
      {children}
    </MenuContext.Provider>
  )
}
