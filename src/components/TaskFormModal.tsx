import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import { AddTaskDto, EditTaskDto, Task } from "../types/TaskTypes";
import {
  CheckboxElement,
  SelectElement,
  TextFieldElement,
  useForm,
} from "react-hook-form-mui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addTask } from "../api/mock_backend";
import LoadingButton from "@mui/lab/LoadingButton";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { parseTimestamp } from "../util/dateUtils";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

type Props = {
  task?: Partial<Task>;
  open: boolean;
  onClose: () => void;
};

export const TaskFormModal = ({ task, open, onClose }: Props) => {
  const queryClient = useQueryClient();
  const { mutateAsync: createTaskAsync, isPending: pendingAdd } = useMutation({
    mutationFn: (data: AddTaskDto) => addTask({ data }),
    mutationKey: ["addTask"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Task"] });
    },
  });
  const { mutateAsync: editTaskAsync, isPending: pendingEdit } = useMutation({
    mutationFn: (data: EditTaskDto) => addTask({ data }),
    mutationKey: ["addTask"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Task"] });
    },
  });

  const isPending = pendingAdd || pendingEdit;

  const { control, handleSubmit, reset, setValue, watch } = useForm<AddTaskDto>(
    {
      defaultValues: {
        due_date: Date.now(),
        ...task,
      },
    }
  );

  const submit = async (data: any) => {
    // The library for forms is setting the wrong values
    // so I compensate by unpacking options
    const unpackValues = Object.entries(data)
      .map(([key, value]) =>
        typeof value === "object"
          ? { [key]: (value as any)?.id || value }
          : { [key]: value }
      )
      .reduce((acc, cur) => ({ ...acc, ...cur }), {}) as AddTaskDto;

    if (task?.id) {
      const editTask: EditTaskDto = {
        ...unpackValues,
        id: task.id,
      };
      await editTaskAsync(editTask);
    } else {
      await createTaskAsync(unpackValues);
    }
    reset();
    onClose();
  };

  const priorityOptions = [
    { id: "low", label: "Low" },
    { id: "medium", label: "Medium" },
    { id: "high", label: "High" },
  ];

  // To rerender the file input when the value is updated
  const values = watch();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog open={open} onClose={onClose}>
        <form onSubmit={handleSubmit(submit)} noValidate>
          <DialogTitle>
            <Typography variant="h6">
              {task?.id ? "Edit" : "Add"} task
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2}>
              <TextFieldElement
                name={"title"}
                label={"Title"}
                control={control}
                required
                fullWidth
              />
              <DatePicker
                label={"Due date *"}
                value={dayjs(parseTimestamp(values.due_date))}
                onChange={(value) =>
                  setValue("due_date", value?.toDate().getTime() || Date.now())
                }
              />
              <SelectElement
                name={"priority"}
                label={"Priority"}
                control={control}
                options={priorityOptions}
                required
              />
              <CheckboxElement
                name={"completed"}
                label={"Completed"}
                control={control}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => onClose()}>Cancel</Button>
            <LoadingButton
              type={"submit"}
              color={"primary"}
              loading={isPending}
            >
              Submit
            </LoadingButton>
          </DialogActions>
        </form>
      </Dialog>
    </LocalizationProvider>
  );
};
