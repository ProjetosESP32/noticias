import { Client } from './client'
import { FileAttachment } from './file'
import { News } from './news'

export interface Group {
  id: number
  name: string
  description: string
  instagramToken: string | null
  newsSource: string | null
  newsSourceSelector: string | null
  createdAt: string
  updatedAt: string
}

export interface RelatedGroup extends Group {
  files: FileAttachment[]
  news: News[]
}

export interface FullGroup extends RelatedGroup {
  clients: Client[]
}
