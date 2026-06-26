import { Table } from 'flowbite-react';

const listingTableTheme = {
    root: {
        shadow: 'hidden pointer-events-none',
        wrapper: 'relative isolate',
    },
};

const ListingTable = ({ children, className = '', hoverable = true, ...props }) => (
    <div className={className}>
        <Table hoverable={hoverable} theme={listingTableTheme} {...props}>
            {children}
        </Table>
    </div>
);

ListingTable.Head = Table.Head;
ListingTable.Body = Table.Body;
ListingTable.Row = Table.Row;
ListingTable.Cell = Table.Cell;
ListingTable.HeadCell = Table.HeadCell;

export default ListingTable;
