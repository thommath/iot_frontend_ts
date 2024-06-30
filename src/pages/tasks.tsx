import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { AppContext } from "../contexts/AppContext";
import { Table } from "../components/table/Table";
import { GridColDef } from "@mui/x-data-grid";
import { formatFileSize } from "../util/fileSize";
import { formatTimestamp, parseTimestamp } from "../util/dateUtils";
import { Page } from "../components/Page";
import { TaskFormModal } from "../components/modals/TaskFormModal";
import AddIcon from "@mui/icons-material/Add";
import { GenericActionsMenu } from "../components/table/GenericActionsMenu";
import { Task } from "../types/TaskTypes";
import { deleteTask, getTaskList } from "../api/mock_backend";
import dayjs from "dayjs";

const columns: GridColDef<Task>[] = [
  {
    field: "title",
    headerName: "Title",
    flex: 1,
  },
  {
    field: "priority",
    headerName: "Priority",
    width: 150,
  },
  {
    field: "due_date",
    headerName: "Due date",
    width: 150,
    type: "date",
    valueFormatter: (value) => dayjs(parseTimestamp(value)),
    renderCell: ({value}) => formatTimestamp(parseTimestamp(value))
  },
  {
    field: "completed",
    headerName: "Completed",
    width: 100,
    type: "boolean",
  },
  {
    field: "actions",
    headerName: "Actions",
    type: "number",
    disableReorder: true,
    filterable: false,
    flex: 1,
    renderCell: (params) => <TaskActions task={params.row} />,
  },
];

const TaskActions = ({ task }: { task: Task }) => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: () => deleteTask({ id: task.id }),
    mutationKey: ["deleteTask"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Task"] });
    },
  });
  const [openEditPopup, setOpenEditPopup] = useState(false);

  return (
    <>
      <GenericActionsMenu
        actions={[
          {
            label: "Delete",
            func: mutate,
          },
          {
            label: "Edit",
            func: () => setOpenEditPopup(true),
          },
        ]}
      />
      <TaskFormModal
        task={task}
        open={openEditPopup}
        onClose={() => setOpenEditPopup(false)}
      />
    </>
  );
};

export const TaskPage = () => {
  const { data, error, isLoading } = useQuery({
    queryFn: () => getTaskList(),
    queryKey: ["Task"],
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
      <Page title="Task">
        <CircularProgress />
      </Page>
    );
  }

  const AddButton = (
    <Box>
      <Button endIcon={<AddIcon />} onClick={() => setOpenCreateForm(true)}>
        Add Task
      </Button>
    </Box>
  );

  return (
    <Page title="Tasks" titleEndSlot={AddButton}>
      <Paper>
        <Box>
          <Table columns={columns} rows={data.tasks} />
        </Box>
        <TaskFormModal
          open={openCreateForm}
          onClose={() => setOpenCreateForm(false)}
        />
      </Paper>
    </Page>
  );
};
