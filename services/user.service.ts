import { api } from "./api"

export const getUser = (id: string) => api.get(`/users/${id}`)

export const getUserWithChildren = (id: string) => api.get(`/users/${id}?include=enfants`)

export const getParentWithChildren = (id: string) => api.get(`/parents/${id}`)

export const getAdminStats = () => api.get("/admin/stats")

export const getUsersList = (page = 1, limit = 10, searchTerm = '', statusFilter = '', roleFilter = '') => 
  api.get(`/admin/users?page=${page}&limit=${limit}&search=${searchTerm}&status=${statusFilter}&role=${roleFilter}`)

export const getOrthophonistesList = (page = 1, limit = 10, searchTerm = '', statusFilter = '') => 
  api.get(`/admin/users?page=${page}&limit=${limit}&search=${searchTerm}&status=${statusFilter}&role=ORTHOPHONISTE`)

export const getParentsList = (page = 1, limit = 10, searchTerm = '', statusFilter = '') => 
  api.get(`/admin/users?page=${page}&limit=${limit}&search=${searchTerm}&status=${statusFilter}&role=PARENT&include=enfants`)

export const deleteUser = (id: string) => api.delete(`/admin/users/${id}`)

export const deleteOrthophoniste = (id: string) => api.delete(`/admin/users/${id}`)

export const deleteParent = (id: string) => api.delete(`/admin/users/${id}`)
