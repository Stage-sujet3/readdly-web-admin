import { api } from "./api"
import { userServiceApi } from "./userService.api"

export const getUser = (id: string) => api.get(`/users/${id}`)

export const getUserWithChildren = (id: string) => api.get(`/users/${id}?include=enfants`)

// Calls user-service REST directly (port 3001) — returns enfants for a parent
export const getParentWithChildren = (id: string) => userServiceApi.get(`/users/${id}/enfants`)

export const getParentEnfants = (id: string) => api.get(`/admin/parents/${id}/enfants`)

export const getGlobalAnalytics = () => api.get("/admin/analytics/global")
export const getActivityAnalytics = () => api.get("/admin/analytics/activity")
export const getUsageAnalytics = () => api.get("/admin/analytics/usage")

export const getAdminStats = (signal?: AbortSignal) => api.get("/admin/stats", { signal })

export const getUsersList = (page = 1, limit = 10, searchTerm = '', statusFilter = '', roleFilter = '') => 
  api.get(`/admin/users?page=${page}&limit=${limit}&search=${searchTerm}&status=${statusFilter}&role=${roleFilter}`)

export const getOrthophonistesList = (page = 1, limit = 10, searchTerm = '', statusFilter = '') => 
  api.get(`/admin/users?page=${page}&limit=${limit}&search=${searchTerm}&status=${statusFilter}&role=ORTHOPHONISTE`)

export const getParentsList = (page = 1, limit = 10, searchTerm = '', statusFilter = '') => 
  api.get(`/admin/users?page=${page}&limit=${limit}&search=${searchTerm}&status=${statusFilter}&role=PARENT`)

export const deleteUser = (id: string) => api.delete(`/admin/users/${id}`)

export const deleteOrthophoniste = (id: string) => api.delete(`/admin/users/${id}`)

export const deleteParent = (id: string) => api.delete(`/admin/users/${id}`)

export const verifyOrthophoniste = (id: string) =>
  api.post(`/admin/orthophonistes/${id}/verify`)

export const rejectOrthophoniste = (id: string, reason: string) =>
  api.post(`/admin/orthophonistes/${id}/reject`, { reason })

export const viewOrthophonisteDocs = (id: string, password?: string) =>
  api.post(`/admin/orthophonistes/${id}/view-docs`, { password })

// Monitoring
export const getMonitoringSummary = () => api.get("/admin/monitoring/summary")

// Audit Logs
export const getAuditLogs = (params: any) => {
  const query = new URLSearchParams(params).toString()
  return api.get(`/admin/audit/logs?${query}`)
}

export const clearAuditLogs = () => api.delete("/admin/audit/logs")

