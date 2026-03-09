import { User, UserFile } from "@/types/user"

export interface UserWithFiles extends User {
  authProvider?: string
}

export interface UsersListResponse {
  users: UserWithFiles[]
  total: number
}
