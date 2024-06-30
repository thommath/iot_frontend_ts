import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import { AddFirmwareDto } from "../../types/FirmwareTypes";
import {
  AutocompleteElement,
  TextFieldElement,
  useForm,
} from "react-hook-form-mui";
import { MuiFileInput } from "mui-file-input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addFirmware } from "../../api/iot_backend";
import { useContext } from "react";
import { AppContext } from "../../contexts/AppContext";
import LoadingButton from "@mui/lab/LoadingButton";

type Props = {
  knownPrograms: string[];
  open: boolean;
  onClose: () => void;
};

export const FirmwareFormModal = ({ knownPrograms, open, onClose }: Props) => {
  const { token } = useContext(AppContext);
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: AddFirmwareDto) => addFirmware({ token, data }),
    mutationKey: ["addFirmware"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["firmware"] });
    },
  });

  const { control, handleSubmit, setValue, watch, reset } =
    useForm<AddFirmwareDto>({
      defaultValues: {},
    });

  const submit = async (data: any) => {
    // The library for forms is setting the wrong values
    // so I compensate by unpacking options
    const unpackValues = Object.entries(data)
      .map(([key, value]) =>
        typeof value === "object"
          ? { [key]: (value as any)?.id || value }
          : { [key]: value }
      )
      .reduce((acc, cur) => ({ ...acc, ...cur }), {}) as AddFirmwareDto;

    await mutateAsync(unpackValues);
    reset();
    onClose();
  };

  const platformOptions = [
    { id: "ESP32", label: "ESP32" },
    { id: "ESP8266", label: "ESP8266" },
  ];
  const programOptions = knownPrograms.map((program) => ({
    id: program,
    label: program,
  }));

  // To rerender the file input when the value is updated
  const values = watch();

  return (
    <Dialog open={open} onClose={onClose}>
      <form onSubmit={handleSubmit(submit)} noValidate>
        <DialogTitle>
          <Typography variant="h6">Upload Firmware</Typography>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <TextFieldElement
              name={"version"}
              label={"Version"}
              control={control}
              type="number"
              required
              fullWidth
            />
            <AutocompleteElement
              name={"platform"}
              label={"Platform"}
              control={control}
              options={platformOptions}
              required
            />
            <AutocompleteElement
              name={"program"}
              label={"Program"}
              control={control}
              options={programOptions}
              required
            />
            <MuiFileInput
              value={values.file}
              onChange={(file) => setValue("file", file as File)}
              label="File"
              required
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => onClose()}>Cancel</Button>
          <LoadingButton type={"submit"} color={"primary"} loading={isPending}>
            Submit
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};
