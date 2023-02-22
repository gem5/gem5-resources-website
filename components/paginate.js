import Pagination from 'react-bootstrap/Pagination'

export default function Paginate({pageCount, currentPage, maxNumberPages, setCurrentPage}) {
    const halfPagesToShow = Math.floor(maxNumberPages / 2);

    if (pageCount <= 1) {
        return (null)
    }

    let startPage = Math.max(currentPage - halfPagesToShow, 1);
    let endPage = Math.min(startPage + maxNumberPages - 1, pageCount);

    if (endPage - startPage < maxNumberPages - 1) {
        startPage = Math.max(endPage - maxNumberPages + 1, 1);
    }

    return (
        <Pagination className="justify-content-center gap-1">
            <Pagination.First onClick={()=>{setCurrentPage(1)}} disabled={currentPage === 1} />
            <Pagination.Prev onClick={()=>{setCurrentPage(currentPage - 1)}} disabled={currentPage === 1} />
            {Array.from({length: endPage - startPage + 1}).map((_, index) => {
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
            <Pagination.Next onClick={()=>{setCurrentPage(currentPage + 1)}} disabled={currentPage === pageCount} />
            <Pagination.Last onClick={()=>{setCurrentPage(pageCount)}} disabled={currentPage === pageCount} />
        </Pagination>
    )
}