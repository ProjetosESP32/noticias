import type { FileAttachment } from './file'
import type { RelatedGroup } from './group'
import type { News } from './news'

export interface Client {
  id: number
  groupId: number
  name: string
  description: string
  hasSound: boolean
  audioUrl: string | null
  showNews: boolean
  showGroupNews: boolean
}

export interface FullClient extends Client {
  relatedGroup: RelatedGroup
  news: News[]
  files: FileAttachment[]
}
