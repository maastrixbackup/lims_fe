import React from "react";

const Pagination = ({
  page,
  totalPages,
  setPage,
  limit,
  setLimit,

}) => {
  if (totalPages <= 1) return null;


  return (
    <div className="">
      {totalPages > 1 && (
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

            {/* Pagination */}
            <div className="join">
              <button
                className="join-item btn btn-sm"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Prev
              </button>

              <button
                className={`join-item btn btn-sm ${
                  page === 1 ? "btn-primary" : ""
                }`}
                onClick={() => setPage(1)}
              >
                1
              </button>

              {page > 3 && (
                <button className="join-item btn btn-sm btn-disabled">…</button>
              )}

              {page > 2 && (
                <button
                  className="join-item btn btn-sm"
                  onClick={() => setPage(page - 1)}
                >
                  {page - 1}
                </button>
              )}

              {page !== 1 && page !== totalPages && (
                <button className="join-item btn btn-sm btn-primary">
                  {page}
                </button>
              )}

              {page < totalPages - 1 && (
                <button
                  className="join-item btn btn-sm"
                  onClick={() => setPage(page + 1)}
                >
                  {page + 1}
                </button>
              )}

              {page < totalPages - 2 && (
                <button className="join-item btn btn-sm btn-disabled">…</button>
              )}

              <button
                className={`join-item btn btn-sm ${
                  page === totalPages ? "btn-primary" : ""
                }`}
                onClick={() => setPage(totalPages)}
              >
                {totalPages}
              </button>

              <button
                className="join-item btn btn-sm"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </button>
            </div>
          </div>
        )}
    </div>
  );
};

export default Pagination;
