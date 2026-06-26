import { Table } from 'flowbite-react';

const listingTableTheme = {
    root: {
        shadow: 'hidden',
    },
};

const ListingTable = ({ children, className = '', hoverable = true, ...props }) => (
    <Table hoverable={hoverable} theme={listingTableTheme} className={className} {...props}>
        {children}
    </Table>
);

ListingTable.Head = Table.Head;
ListingTable.Body = Table.Body;
ListingTable.Row = Table.Row;
ListingTable.Cell = Table.Cell;
ListingTable.HeadCell = Table.HeadCell;

export default ListingTable;
