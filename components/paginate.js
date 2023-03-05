import Pagination from 'react-bootstrap/Pagination'
import styles from '/styles/paginate.module.css'

export default function Paginate({ pageCount, currentPage, maxPageNumbersShown, setCurrentPage, paginationSize }) {
    const halfPagesToShow = Math.floor(maxPageNumbersShown / 2);
    // const halfPagesToShow = 4;

    if (pageCount <= 1) {
        return (null)
    }

    let startPage = Math.max(currentPage - halfPagesToShow, 1);
    // let endPage = Math.min(startPage + maxPageNumbersShown - 1, pageCount);
    let endPage = Math.min(currentPage + halfPagesToShow, pageCount);

    if (endPage - startPage < maxPageNumbersShown - 1) {
        startPage = Math.max(endPage - maxPageNumbersShown + 1, 1);
    }

    return (
        <Pagination className={`${styles.pagination} justify-content-center gap-1`} size={paginationSize}>
            <Pagination.First onClick={() => { setCurrentPage(1) }} disabled={currentPage === 1} />
            <Pagination.Prev onClick={() => { setCurrentPage(currentPage - 1) }} disabled={currentPage === 1} />
            {Array.from({ length: endPage - startPage + 1 }).map((_, index) => {
                const pageNumber = startPage + index;
                return (
                    <Pagination.Item
                        key={pageNumber}
                        active={pageNumber === currentPage}
                        onClick={() => setCurrentPage(pageNumber)}
                        className=''
                    >
                        {pageNumber}
                    </Pagination.Item>
                );
            })}
            <Pagination.Next onClick={() => { setCurrentPage(currentPage + 1) }} disabled={currentPage === pageCount} />
            <Pagination.Last onClick={() => { setCurrentPage(pageCount) }} disabled={currentPage === pageCount} />
        </Pagination>
    )
}
