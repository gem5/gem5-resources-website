import { render, screen, fireEvent, act } from '@testing-library/react';
import Paginate from '@/components/paginate';

const setCurrentPage = jest.fn();

describe('Paginate', () => {
    it('should not render the pagination component', () => {
        render(<Paginate
            pageCount={1}
            currentPage={1}
            maxPageNumbersShown={5}
            setCurrentPage={setCurrentPage}
            paginationSize='sm'
        />)
        const pagination = screen.queryByRole('navigation');
        expect(pagination).not.toBeInTheDocument();
    });

    it('should render the pagination component', () => {
        render(<Paginate
            pageCount={5}
            currentPage={1}
            maxPageNumbersShown={5}
            setCurrentPage={setCurrentPage}
            paginationSize='sm'
        />)
        const pagination = screen.getByRole('list');
        expect(pagination).toBeInTheDocument();
        // get all the li elements
        // they should be 9, 2 for the first and last page buttons, 2 for the previous and next page buttons,
        // and 5 for the page number buttons
        const listItems = screen.getAllByRole('listitem');
        expect(listItems).toHaveLength(9);
        // get all the page number buttons
        const pageNumbers = screen.getAllByRole('button');
        // the buttons should be 2, 3, 4, 5, >, and >>, so there should be 6 buttons
        expect(pageNumbers).toHaveLength(6);
        // click the next page button
        fireEvent.click(pageNumbers[5]);
        expect(setCurrentPage).toHaveBeenCalledWith(5);
    });

    it('should render the correct page number buttons', () => {
        render(<Paginate
            pageCount={10}
            currentPage={9}
            maxPageNumbersShown={5}
            setCurrentPage={setCurrentPage}
            paginationSize='sm'
        />)
        const pageNumbers = screen.getAllByRole('button');
        // <<, <, 6, 7, 8, 10 >, and >>
        expect(pageNumbers[2]).toHaveTextContent('6');
        expect(pageNumbers[3]).toHaveTextContent('7');
        expect(pageNumbers[4]).toHaveTextContent('8');
        expect(pageNumbers[5]).toHaveTextContent('10');
    });

    it('should update the page correctly on clicking next page button', () => {
        render(<Paginate
            pageCount={5}
            currentPage={1}
            maxPageNumbersShown={5}
            setCurrentPage={setCurrentPage}
            paginationSize='sm'
        />)
        const pageNumbers = screen.getAllByRole('button');
        // 2, 3, 4, 5, >, >>
        fireEvent.click(pageNumbers[4]);
        expect(setCurrentPage).toHaveBeenCalledWith(2);
        fireEvent.click(pageNumbers[5]);
        expect(setCurrentPage).toHaveBeenCalledWith(5);
    });

    it('should update the page correctly on clicking previous page button', () => {
        render(<Paginate
            pageCount={5}
            currentPage={5}
            maxPageNumbersShown={5}
            setCurrentPage={setCurrentPage}
            paginationSize='sm'
        />)
        const pageNumbers = screen.getAllByRole('button');
        // <<, <, 1, 2, 3, 4
        fireEvent.click(pageNumbers[1]);
        expect(setCurrentPage).toHaveBeenCalledWith(4);
        fireEvent.click(pageNumbers[0]);
        expect(setCurrentPage).toHaveBeenCalledWith(1);
    });
});