import { api } from "./api"

export const getUser = (id: string) => api.get(`/users/${id}`)

export const getAdminStats = () => api.get("/admin/stats")

export const getUsersList = (page = 1, limit = 10) => 
  api.get(`/admin/users?page=${page}&limit=${limit}`)

export const deleteUser = (id: string) => api.delete(`/admin/users/${id}`)
