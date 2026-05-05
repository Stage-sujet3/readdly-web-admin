"use client"

import { useOrthophonistes } from "@/features/orthophonistes/hooks/useOrthophonistes"
import { OrthophonistesStats } from "@/features/orthophonistes/components/OrthophonistesStats/OrthophonistesStats"
import { OrthophonistesFilter } from "@/features/orthophonistes/components/OrthophonistesFilter/OrthophonistesFilter"
import { OrthophonistesTable } from "@/features/orthophonistes/components/OrthophonistesTable/OrthophonistesTable"
import { OrthophonisteDetails } from "@/features/orthophonistes/components/OrthophonisteDetails/OrthophonisteDetails"
import { OrthophonisteDeleteModal } from "@/features/orthophonistes/components/OrthophonisteDeleteModal/OrthophonisteDeleteModal"

export default function OrthophonistesPage() {
  const {
    orthophonistes,
    stats,
    total,
    page,
    setPage,
    limit,
    selectedOrthophoniste,
    setSelectedOrthophoniste,
    orthophonisteToDelete,
    setOrthophonisteToDelete,
    isDeleting,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    loadUserDetails,
    handleDeleteOrthophoniste,
    getStatusDisplay,
    isLoading
  } = useOrthophonistes();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pl-6">
      <OrthophonistesStats stats={stats} />
      
      <OrthophonistesFilter 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />
      
      <OrthophonistesTable 
        orthophonistes={orthophonistes}
        total={total}
        page={page}
        setPage={setPage}
        limit={limit}
        loadUserDetails={loadUserDetails}
        setOrthophonisteToDelete={setOrthophonisteToDelete}
        getStatusDisplay={getStatusDisplay}
        isLoading={isLoading}
      />

      <OrthophonisteDetails 
        selectedOrthophoniste={selectedOrthophoniste}
        setSelectedOrthophoniste={setSelectedOrthophoniste}
        setOrthophonisteToDelete={setOrthophonisteToDelete}
        getStatusDisplay={getStatusDisplay}
      />

      <OrthophonisteDeleteModal 
        orthophonisteToDelete={orthophonisteToDelete}
        setOrthophonisteToDelete={setOrthophonisteToDelete}
        handleDeleteOrthophoniste={handleDeleteOrthophoniste}
        isDeleting={isDeleting}
      />
    </div>
  )
}
