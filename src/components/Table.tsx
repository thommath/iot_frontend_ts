import { Box } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

type TableProps = {
  columns: GridColDef<any>[];
  rows: any[];
};

export const Table = ({ rows, columns }: TableProps) => {
  return (
    <Box sx={{ width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[10, 20, 50]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
  );
};
