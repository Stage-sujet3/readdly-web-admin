"use client"

import { useParents } from "@/features/parents/hooks/useParents"
import { ParentsStats } from "@/features/parents/components/ParentsStats/ParentsStats"
import { ParentsFilter } from "@/features/parents/components/ParentsFilter/ParentsFilter"
import { ParentsTable } from "@/features/parents/components/ParentsTable/ParentsTable"
import { ParentDetails } from "@/features/parents/components/ParentDetails/ParentDetails"
import { ParentDeleteModal } from "@/features/parents/components/ParentDeleteModal/ParentDeleteModal"

export default function ParentsPage() {
  const {
    parents,
    stats,
    total,
    page,
    setPage,
    limit,
    selectedParent,
    setSelectedParent,
    parentToDelete,
    setParentToDelete,
    isDeleting,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    loadUserDetails,
    handleDeleteParent,
    getStatusDisplay,
    fetchParentChildren,
    isLoading
  } = useParents();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pl-6">
      {isLoading ? (
        <div className="space-y-8 animate-pulse">
          {/* Stats Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 h-24">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-2xl"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-3 bg-slate-100 rounded w-16"></div>
                    <div className="h-6 bg-slate-200 rounded w-12"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Table Skeleton */}
          <div className="bg-white rounded-[2rem] border border-slate-100 h-96 p-8">
            <div className="h-8 bg-slate-100 rounded-xl w-48 mb-8"></div>
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-12 bg-slate-50 rounded-xl w-full"></div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <>
          <ParentsStats stats={stats} />
          
          <ParentsFilter 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />
          
          <ParentsTable 
            parents={parents}
            total={total}
            page={page}
            setPage={setPage}
            limit={limit}
            loadUserDetails={loadUserDetails}
            setParentToDelete={setParentToDelete}
            getStatusDisplay={getStatusDisplay}
            fetchParentChildren={fetchParentChildren}
          />
        </>
      )}

      <ParentDetails 
        selectedParent={selectedParent}
        setSelectedParent={setSelectedParent}
        setParentToDelete={setParentToDelete}
        getStatusDisplay={getStatusDisplay}
      />

      <ParentDeleteModal 
        parentToDelete={parentToDelete}
        setParentToDelete={setParentToDelete}
        handleDeleteParent={handleDeleteParent}
        isDeleting={isDeleting}
      />
    </div>
  )
}
