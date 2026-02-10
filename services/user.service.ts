import { api } from "./api"
export const getUser = (id: string) => api.get(`/users/${id}`)
