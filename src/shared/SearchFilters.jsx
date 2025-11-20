import React from 'react'

const SearchFilters = ({ filters, setFilters, roles, isRestricted, openModal }) => (
  <div className="flex flex-col sm:flex-row justify-between gap-3 items-center">
    <h2 className="text-lg font-semibold">User Management</h2>

    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
      <input
        type="search"
        placeholder="Search by name"
        value={filters.query}
        onChange={(e) => setFilters((p) => ({ ...p, query: e.target.value }))}
        className="input input-bordered w-full sm:w-64"
      />

      <select
        value={filters.role}
        onChange={(e) => setFilters((p) => ({ ...p, role: e.target.value }))}
        className="select select-bordered w-full sm:w-48"
      >
        <option value="all">All Roles</option>
        {roles.map((r) => (
          <option key={r.id} value={r.id}>
            {r.name}
          </option>
        ))}
      </select>

      <button
        className="btn btn-primary"
        onClick={openModal}
        disabled={isRestricted}
      >
        + Add User
      </button>
    </div>
  </div>
);

export default SearchFilters