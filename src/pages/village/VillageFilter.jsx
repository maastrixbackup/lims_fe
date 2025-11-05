import React from "react";

const VillageFilter = ({ filter, setFilter, projects, odishaDistricts, role }) => {
  return (
    <div className="card bg-white shadow-lg p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
      <select
        name="project_id"
        value={filter.project_id}
        onChange={(e) => setFilter({ ...filter, project_id: e.target.value })}
        className="select select-bordered"
      >
        {role === "Data Entry User" && <option value="">All Projects</option>}
        {projects.map((p) => (
          <option key={p.id} value={p.id}>
            {p.project_name}
          </option>
        ))}
      </select>

      <select
        name="district"
        value={filter.district}
        onChange={(e) => setFilter({ ...filter, district: e.target.value })}
        className="select select-bordered"
      >
        <option value="">All Districts</option>
        {odishaDistricts.map((d) => (
          <option key={d}>{d}</option>
        ))}
      </select>

      <input
        type="text"
        name="tahasil"
        value={filter.tahasil}
        onChange={(e) => setFilter({ ...filter, tahasil: e.target.value })}
        placeholder="Search Tahasil"
        className="input input-bordered"
      />
    </div>
  );
};

export default VillageFilter;
