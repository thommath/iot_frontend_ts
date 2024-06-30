import { Box } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

type TableProps = {
  columns: GridColDef<any>[];
  rows: any[];
};

export const Table = ({ rows, columns }: TableProps) => {
  return (
    <Box sx={{ width: "100%", height: "70vh" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 100,
            },
          },
        }}
        pageSizeOptions={[10, 20, 50, 100]}
        disableRowSelectionOnClick
      />
    </Box>
  );
};
