import { useQuery } from "@tanstack/react-query";
import { Page } from "../components/Page";
import { getDevices } from "../api/iot_backend";
import { useContext, useState } from "react";
import { AppContext } from "../contexts/AppContext";
import { DeviceCard } from "../components/Device";
import { Box, CircularProgress, Grid, Stack, Typography } from "@mui/material";

export const DevicesPage = () => {
  const { token } = useContext(AppContext);
  const { data, isLoading, error } = useQuery({
    queryFn: () => getDevices({ token }),
    queryKey: ["devices"],
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
      <Page title="Devices">
        <CircularProgress />
      </Page>
    );
  }

  return (
    <Page title="Devices">
      <Grid container spacing={2} justifyContent="space-between">
        {data.clients.map((device, i) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={device.id + i}>
            <DeviceCard device={device} />
          </Grid>
        ))}
      </Grid>
    </Page>
  );
};
