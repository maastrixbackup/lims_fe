import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ page, totalPages, setPage, limit, setLimit }) => {
  if (totalPages <= 0) return null;

  return (
    <div className="w-full border-t border-slate-200/80 bg-white px-4 py-3 sm:px-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Left: Page Size Selector */}
        <div className="flex items-center gap-2.5 text-xs text-slate-600">
          <span className="font-medium text-slate-500">Rows per page:</span>
          <select
            className="h-8 rounded-lg border border-slate-200 bg-slate-50/50 px-2.5 text-xs font-medium text-slate-700 outline-none transition-all hover:bg-slate-100 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
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

        {/* Right: Page Navigation Controls */}
        <div className="flex items-center gap-1.5">
          {/* Previous Button */}
          <button
            type="button"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-600 transition-all hover:bg-slate-50 hover:text-slate-900 disabled:pointer-events-none disabled:opacity-40"
          >
            <ChevronLeft size={14} />
            <span className="hidden sm:inline">Previous</span>
          </button>

          {/* Page Number Buttons */}
          <div className="flex items-center gap-1">
            {totalPages === 1 ? (
              <button
                type="button"
                className="h-8 min-w-[32px] rounded-lg bg-indigo-600 text-xs font-semibold text-white shadow-xs"
              >
                1
              </button>
            ) : (
              <>
                {/* First Page */}
                <button
                  type="button"
                  onClick={() => setPage(1)}
                  className={`h-8 min-w-[32px] rounded-lg px-2 text-xs font-medium transition-all ${
                    page === 1
                      ? "bg-indigo-600 text-white shadow-xs font-semibold"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  1
                </button>

                {/* Left Ellipsis */}
                {page > 3 && (
                  <span className="px-1 text-xs text-slate-400 select-none">
                    •••
                  </span>
                )}

                {/* Previous Page Link */}
                {page > 2 && (
                  <button
                    type="button"
                    onClick={() => setPage(page - 1)}
                    className="h-8 min-w-[32px] rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition-all"
                  >
                    {page - 1}
                  </button>
                )}

                {/* Current Active Middle Page */}
                {page !== 1 && page !== totalPages && (
                  <button
                    type="button"
                    className="h-8 min-w-[32px] rounded-lg bg-indigo-600 px-2 text-xs font-semibold text-white shadow-xs transition-all"
                  >
                    {page}
                  </button>
                )}

                {/* Next Page Link */}
                {page < totalPages - 1 && (
                  <button
                    type="button"
                    onClick={() => setPage(page + 1)}
                    className="h-8 min-w-[32px] rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition-all"
                  >
                    {page + 1}
                  </button>
                )}

                {/* Right Ellipsis */}
                {page < totalPages - 2 && (
                  <span className="px-1 text-xs text-slate-400 select-none">
                    •••
                  </span>
                )}

                {/* Last Page */}
                <button
                  type="button"
                  onClick={() => setPage(totalPages)}
                  className={`h-8 min-w-[32px] rounded-lg px-2 text-xs font-medium transition-all ${
                    page === totalPages
                      ? "bg-indigo-600 text-white shadow-xs font-semibold"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {totalPages}
                </button>
              </>
            )}
          </div>

          {/* Next Button */}
          <button
            type="button"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-600 transition-all hover:bg-slate-50 hover:text-slate-900 disabled:pointer-events-none disabled:opacity-40"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight size={14} />
          </button>
        </div>

      </div>
    </div>
  );
};

export default Pagination;