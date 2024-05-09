export interface FileAttachment {
  id: number
  groupId: number
  clientId: number | null
  provider: string
  file: string
  mime: string
  createdAt: string
  updatedAt: string
}
