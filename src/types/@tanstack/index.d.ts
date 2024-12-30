import { RowData } from '@tanstack/react-table';

declare module '@tanstack/react-table' {
  export interface ColumnFilterComponentProps {
    filterValue: any;
    setFilterValue: (value: any) => void;
    hideFilter?: () => void;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export interface ColumnDefBase<TData extends RowData, TValue = unknown> {
    filter?: React.FC<ColumnFilterComponentProps>;
  }
}
