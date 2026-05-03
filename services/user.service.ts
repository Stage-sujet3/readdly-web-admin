import { api } from "./api"
import { userServiceApi } from "./userService.api"

export const getUser = (id: string) => api.get(`/users/${id}`)

export const getUserWithChildren = (id: string) => api.get(`/users/${id}?include=enfants`)

// Calls user-service REST directly (port 3001) — returns full user with enfants[]
export const getParentWithChildren = (id: string) => userServiceApi.get(`/users/${id}`)

export const getAdminStats = () => api.get("/admin/stats")

export const getUsersList = (page = 1, limit = 10, searchTerm = '', statusFilter = '', roleFilter = '') => 
  api.get(`/admin/users?page=${page}&limit=${limit}&search=${searchTerm}&status=${statusFilter}&role=${roleFilter}`)

export const getOrthophonistesList = (page = 1, limit = 10, searchTerm = '', statusFilter = '') => 
  api.get(`/admin/users?page=${page}&limit=${limit}&search=${searchTerm}&status=${statusFilter}&role=ORTHOPHONISTE`)

export const getParentsList = (page = 1, limit = 10, searchTerm = '', statusFilter = '') => 
  api.get(`/admin/users?page=${page}&limit=${limit}&search=${searchTerm}&status=${statusFilter}&role=PARENT`)

export const deleteUser = (id: string) => api.delete(`/admin/users/${id}`)

export const deleteOrthophoniste = (id: string) => api.delete(`/admin/users/${id}`)

export const deleteParent = (id: string) => api.delete(`/admin/users/${id}`)
