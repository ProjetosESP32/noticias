import { Link } from '@inertiajs/react'
import type { DefaultProps } from '~/utils/props'

import styles from './dashboard.module.scss'

interface DashboardProps {
  children: React.ReactNode
}

export const Dashboard = ({ loggedUser, children }: DefaultProps<DashboardProps>) => (
  <div className={styles.container}>
    <header className={styles.header}>
      <div>
        <h1>Notícias</h1>
      </div>

      <div>
        <span>{loggedUser.username}</span>
        <Link href="/auth" as="button" type="button" method="delete">
          Sair
        </Link>
      </div>
    </header>
    <hr />
    {children}
  </div>
)
