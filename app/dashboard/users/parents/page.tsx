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
    getStatusDisplay
  } = useParents();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pl-6">
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
      />

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
