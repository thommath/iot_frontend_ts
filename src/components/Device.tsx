import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";
import { Device } from "../types/DeviceTypes";
import { useContext, useState } from "react";
import { DeviceFormModal } from "./DeviceFormModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteDevice } from "../api/iot_backend";
import { AppContext } from "../contexts/AppContext";

type Props = {
  device: Device;
};

export const DeviceCard = ({ device }: Props) => {
  const queryClient = useQueryClient();
  const { token } = useContext(AppContext);
  const { mutate } = useMutation({
    mutationFn: () => deleteDevice({ token, id: device.id }),
    mutationKey: ["deleteDevice", device.id],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["devices"] });
    },
  });
  const [openPopupForm, setOpenPopupForm] = useState(false);

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardContent>
        <Typography variant="body1">{device.id}</Typography>
        {device.room && (
          <Typography variant="body2">Room: {device.room}</Typography>
        )}
        {device.program && (
          <Typography variant="body2">Program: {device.program}</Typography>
        )}
      </CardContent>
      <CardActions>
        <Button onClick={() => setOpenPopupForm(true)}>Open</Button>
        <Button onClick={() => mutate()}>Delete</Button>
      </CardActions>
      {openPopupForm && (
        <DeviceFormModal
          device={device}
          open={openPopupForm}
          onClose={() => setOpenPopupForm(false)}
        />
      )}
    </Card>
  );
};
