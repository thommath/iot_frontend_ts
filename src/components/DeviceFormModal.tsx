import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { TextFieldElement, useForm } from "react-hook-form-mui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { saveDevice } from "../api/iot_backend";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../contexts/AppContext";
import LoadingButton from "@mui/lab/LoadingButton";
import { AddDeviceDto, Device } from "../types/DeviceTypes";

type Props = {
  device?: Partial<Device>;
  open: boolean;
  onClose: () => void;
};

export const DeviceFormModal = ({ device, open, onClose }: Props) => {
  const { token } = useContext(AppContext);
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: AddDeviceDto) => saveDevice({ token, data }),
    mutationKey: ["addDevice"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["device"] });
    },
  });

  const { control, handleSubmit, watch, reset, setValue } =
    useForm<AddDeviceDto>({
      defaultValues: device || {},
    });

  const [newKey, setNewKey] = useState("");

  const submit = async (data: AddDeviceDto) => {
    if (!device?.id) {
      // Handle create new
      return;
    }
    // Clean data
    data.id = device.id;
    delete data["password"];
    if (data.owners && !Array.isArray(data.owners)) {
      data.owners = (data.owners as String).split(",").map((s) => s.trim());
    }
    try {
      await mutateAsync(data);
    } catch (error) {
      if (!String(error).includes("Unexpected token 'O'")) {
        throw error;
      }
    }
    reset();
    onClose();
  };

  const values = watch();

  const addKey = () => {
    if (!newKey) return;
    setValue(newKey, "");
    setNewKey("");
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <form onSubmit={handleSubmit(submit)} noValidate>
        <DialogContent>
          <Typography variant="h6">Upload Device</Typography>
          <Stack spacing={2} marginTop="1rem">
            {Object.keys(values).map((key) => (
              <TextFieldElement
                key={key}
                name={key}
                label={key}
                control={control}
                required
                fullWidth
                disabled={Boolean(device?.id) && key === "id"}
              />
            ))}
          </Stack>

          <Stack alignItems="center" direction="row">
            <TextField
              label="Add key"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
            />
            <Button onClick={addKey}>Add key</Button>
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
