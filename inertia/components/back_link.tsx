import { Link } from '@inertiajs/react'
import { ArrowLeft } from 'react-feather'

import styles from './back_link.module.scss'

interface BackLinkProps {
  href: string
}

export const BackLink = ({ href }: BackLinkProps) => (
  <Link className={styles.backLink} href={href}>
    <ArrowLeft size={24} />
    Voltar
  </Link>
)
