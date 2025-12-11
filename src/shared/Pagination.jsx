import React from "react";

const Pagination = ({ page, totalPages, setPage, limit, setLimit }) => {
  return (
    <div className="flex justify-between items-center p-4 border-t bg-gray-50">

      {/* Page Size Selector */}
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-700">Page Size:</span>
        <select
          className="select select-bordered select-sm w-24"
          value={limit}
          onChange={(e) => {
            setLimit(Number(e.target.value));
            setPage(1);
          }}
        >
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </div>

      {/* Pagination Buttons */}
      <div className="join">

        {/* Prev Button */}
        <button
          className="join-item btn btn-sm"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Prev
        </button>

        {/* When only 1 page → show only "1" */}
        {totalPages === 1 ? (
          <button className="join-item btn btn-sm btn-primary">1</button>
        ) : (
          <>
            {/* Page 1 */}
            <button
              className={`join-item btn btn-sm ${page === 1 ? "btn-primary" : ""}`}
              onClick={() => setPage(1)}
            >
              1
            </button>

            {/* Left Ellipsis */}
            {page > 3 && (
              <button className="join-item btn btn-sm btn-disabled">…</button>
            )}

            {/* Page - 1 */}
            {page > 2 && (
              <button
                className="join-item btn btn-sm"
                onClick={() => setPage(page - 1)}
              >
                {page - 1}
              </button>
            )}

            {/* Current Page */}
            {page !== 1 && page !== totalPages && (
              <button className="join-item btn btn-sm btn-primary">
                {page}
              </button>
            )}

            {/* Page + 1 */}
            {page < totalPages - 1 && (
              <button
                className="join-item btn btn-sm"
                onClick={() => setPage(page + 1)}
              >
                {page + 1}
              </button>
            )}

            {/* Right Ellipsis */}
            {page < totalPages - 2 && (
              <button className="join-item btn btn-sm btn-disabled">…</button>
            )}

            {/* Last Page */}
            <button
              className={`join-item btn btn-sm ${
                page === totalPages ? "btn-primary" : ""
              }`}
              onClick={() => setPage(totalPages)}
            >
              {totalPages}
            </button>
          </>
        )}

        {/* Next Button */}
        <button
          className="join-item btn btn-sm"
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
