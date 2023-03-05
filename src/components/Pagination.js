import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import "../css/pagination.css";

function Pagination({ itemsPerPage, total, setActivePage, activePage }) {
  // We start with an empty list of items.
  const [pageCount, setPageCount] = useState(0);

  useEffect(() => {
    setPageCount(Math.ceil(total / itemsPerPage));
    console.log(
      Math.ceil(total / itemsPerPage),
      " total = ",
      total,
      " perpage = ",
      itemsPerPage
    );
  }, [itemsPerPage, total]);

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    // const newOffset = (event.selected * itemsPerPage) % items.length;
    //setItemOffset(newOffset);
    //alert(event.selected);
    setActivePage(event.selected + 1);
    console.log("event.selected = ", event.selected);
  };

  return (
    <>
      <ReactPaginate
        breakLabel="..."
        nextLabel="Next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        pageCount={pageCount}
        previousLabel="< Previous"
        renderOnZeroPageCount={null}
        className="PaginationNew"
      />
    </>
  );
}

export default Pagination;
