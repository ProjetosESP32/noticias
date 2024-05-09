export interface News {
  id: number
  groupId: number
  clientId: number | null
  data: string
  isImported: boolean
  createdAt: string
  updatedAt: string
}
