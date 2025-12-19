import React from "react";

const Pagination = ({ page, totalPages, setPage, limit, setLimit, total }) => {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center p-4 border-t bg-gray-50">
      <div className="flex items-center justify-center sm:justify-start space-x-2">
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
           {/* <option value={total}>All</option> */}
        </select>
      </div>

      <div className="w-full sm:w-auto overflow-x-auto">
        <div className="join justify-center sm:justify-end min-w-max">
          <button
            className="join-item btn btn-sm"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Prev
          </button>

          {totalPages === 1 ? (
            <button className="join-item btn btn-sm btn-primary">1</button>
          ) : (
            <>
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
            </>
          )}
          <button
            className="join-item btn btn-sm"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
