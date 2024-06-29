import {
  Box,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Firmware } from "../types/FirmwareTypes";
import {
  deleteFirmware,
  getFirmware,
  iotBackendBaseUrl,
} from "../api/iot_backend";
import { useContext, useState } from "react";
import { AppContext } from "../contexts/AppContext";
import { Table } from "../components/Table";
import { GridColDef } from "@mui/x-data-grid";
import { formatFileSize } from "../util/fileSize";
import { formatTimestamp, parseTimestamp } from "../util/dateUtils";
import { Page } from "../components/Page";
import { FirmwareFormModal } from "../components/FirmwareFormModal";
import AddIcon from "@mui/icons-material/Add";
import { GenericActionsMenu } from "../components/GenericActionsMenu";
import { downloadURI } from "../util/downloadFile";

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
    field: "program",
    headerName: "Program",
    width: 160,
  },
  {
    field: "size",
    headerName: "Size",
    width: 150,
    type: "number",
    valueFormatter: formatFileSize,
  },
  {
    field: "date",
    headerName: "Date",
    width: 110,
    type: "date",
    valueFormatter: (value) => formatTimestamp(parseTimestamp(value)),
  },
  {
    field: "actions",
    headerName: "Actions",
    width: 110,
    renderCell: (params) => <FirmwareActions firmware={params.row} />,
  },
];

const FirmwareActions = ({ firmware }: { firmware: Firmware }) => {
  const { token } = useContext(AppContext);
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: () => deleteFirmware({ token, id: firmware.id }),
    mutationKey: ["deleteFirmware"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["firmware"] });
    },
  });

  return (
    <>
      <GenericActionsMenu
        actions={[
          {
            label: "Delete",
            func: mutate,
          },
          {
            label: "Download",
            func: () =>
              downloadURI(
                iotBackendBaseUrl + "images/" + firmware.id,
                "firmware.bin"
              ),
          },
        ]}
      />
    </>
  );
};

export const FirmwarePage = () => {
  const { token } = useContext(AppContext);
  const { data, error, isLoading } = useQuery({
    queryFn: () => getFirmware({ token }),
    queryKey: ["firmware"],
    networkMode: "offlineFirst",
  });
  const [openCreateForm, setOpenCreateForm] = useState(false);

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
    return (
      <Page title="Firmware">
        <CircularProgress />
      </Page>
    );
  }

  const knownPrograms = Array.from(
    new Set(data.updates.map(({ program }) => program))
  );

  const AddButton = (
    <Box>
      <Button endIcon={<AddIcon />} onClick={() => setOpenCreateForm(true)}>
        Add Firmware
      </Button>
    </Box>
  );

  return (
    <Page title="Firmware" titleEndSlot={AddButton}>
      <Box>
        <Table columns={columns} rows={data.updates} />
      </Box>
      <FirmwareFormModal
        open={openCreateForm}
        onClose={() => setOpenCreateForm(false)}
        knownPrograms={knownPrograms}
      />
    </Page>
  );
};
