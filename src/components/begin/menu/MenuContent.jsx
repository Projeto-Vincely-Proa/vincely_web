import { useContext } from 'react'
import { MenuContext } from './MenuHamburguer'

export function MenuContent({ children }) {
  const { aberto } = useContext(MenuContext)

  return (
    <div className={`menu-content ${aberto ? 'open' : ''}`}>
      {children}
    </div>
  )
}
