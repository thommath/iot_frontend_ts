import { Box, CircularProgress, Typography } from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Firmware, FirmwareResponse } from "../types/FirmwareTypes";
import { getFirmware } from "../api/iot_backend";
import { useContext } from "react";
import { AppContext } from "../contexts/AppContext";
import { Table } from "../components/Table";
import { GridColDef } from "@mui/x-data-grid";
import { formatFileSize } from "../util/fileSize";
import { formatTimestamp, parseTimestamp } from "../util/dateUtils";

const columns: GridColDef<Firmware>[] = [
  {
    field: "version",
    headerName: "Version",
    width: 150,
  },
  {
    field: "platform",
    headerName: "Platform",
    width: 160,
  },
  {
    field: "size",
    headerName: "Size",
    width: 150,
    valueFormatter: formatFileSize,
  },
  {
    field: "date",
    headerName: "Date",
    width: 110,
    valueFormatter: (value) => formatTimestamp(parseTimestamp(value)),
  },
];

export const FirmwarePage = () => {
  const { token } = useContext(AppContext);
  const { data, error, isLoading } = useQuery({
    queryFn: () => getFirmware({ token }),
    queryKey: ["firmware"],
    networkMode: "offlineFirst",
  });

  if (error) {
    // Report error to mertics service
    console.error(error);
    return (
      <Box>
        <Typography>An error has occured, please send help.</Typography>
      </Box>
    );
  }
  if (isLoading || !data) {
    return <CircularProgress />;
  }

  return (
    <Box>
      <Table columns={columns} rows={data.updates} />
    </Box>
  );
};
