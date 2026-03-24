import React from "react";

const Pagination = ({ totalPosts, postsPerPage, currentPage, setCurrentPage }) => {
  let pages = [];
  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pages.push(i);
  }

  return (
    <div className="flex justify-center items-center gap-3 mt-10">
      {pages.map((page, index) => {
        const isActive = page === currentPage;

        return (
          <button
            key={index}
            onClick={() => setCurrentPage(page)}
            className={`
              w-10 h-10 rounded-lg text-sm font-semibold
              transition-all duration-300 hover:cursor-pointer
              ${isActive
                ? "bg-blue-700 text-black scale-110 shadow-lg"
                : "bg-gray-100/40 text-white hover:bg-orange-600 hover:text-black hover:scale-105"}
            `}
          >
            {page}
          </button>
        );
      })}
    </div>
  );
};

export default Pagination;