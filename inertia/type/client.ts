import { FileAttachment } from './file'
import { RelatedGroup } from './group'
import { News } from './news'

export interface Client {
  id: number
  groupId: number
  name: string
  description: string
  hasSound: boolean
  showNews: boolean
  showGroupNews: boolean
}

export interface FullClient extends Client {
  relatedGroup: RelatedGroup
  news: News[]
  files: FileAttachment[]
}
