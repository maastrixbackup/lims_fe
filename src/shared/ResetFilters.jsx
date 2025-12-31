import React from 'react'

const ResetFilters = ({onClick}) => {
  return (
     <div className="card bg-white shadow-lg py-16 flex flex-col items-center">
      <p className="text-lg font-semibold text-red-600">
        No matching Khata found
      </p>

      <p className="text-sm text-gray-500 mt-1">
        Applied filters returned no results.
      </p>

      <button
        className="btn btn-sm btn-outline btn-primary mt-5"
        onClick={onClick}
      >
        Reset Filters
      </button>
    </div>
  )
}

export default ResetFilters