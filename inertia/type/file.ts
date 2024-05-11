export interface FileAttachment {
  id: number
  groupId: number
  clientId: number | null
  provider: string
  file: string
  mime: string
  isImported: boolean
  hasAudio: boolean
  hasPriority: boolean
  createdAt: string
  updatedAt: string
}
