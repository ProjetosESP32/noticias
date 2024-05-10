export interface FileAttachment {
  id: number
  groupId: number
  clientId: number | null
  provider: string
  file: string
  mime: string
  isImported: boolean
  createdAt: string
  updatedAt: string
}
