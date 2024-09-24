import {
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import React, { useContext } from "react";
import { Page } from "../components/Page";
import { getDevices } from "../api/iot_backend";
import { TokenContext } from "../contexts/TokenContext";
import { Device } from "../types/DeviceTypes";
import HouseIcon from "@mui/icons-material/House";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import OutletIcon from "@mui/icons-material/Outlet";
import PowerIcon from "@mui/icons-material/Power";
import { useNavigate } from "react-router-dom";

export const ControlPage = () => {
  const { token } = useContext(TokenContext);
  const { data, error, isLoading } = useQuery({
    queryFn: () => getDevices({ token }),
    queryKey: ["devices"],
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
    return (
      <Page title="Control">
        <CircularProgress />
      </Page>
    );
  }
  // Group devices by room
  const rooms = data.clients.reduce<Record<string, Device[]>>(
    (acc, device) => ({
      ...acc,
      [device.room || "no room"]: [
        ...(acc[device.room || "no room"] || []),
        device,
      ],
    }),
    {}
  );

  return (
    <Page title="Control">
      <Paper>
        <RoomList rooms={rooms} />
      </Paper>
    </Page>
  );
};

type RoomListProps = {
  rooms: Record<string, Device[]>;
};

// Each room should be clickable to navigate to a control page for the room
// And it should list the devices in the room
// as a MUI list
const RoomList = ({ rooms }: RoomListProps) => {
  const navigate = useNavigate();
  return (
    <List>
      {Object.entries(rooms).map(([room, devices]) => (
        <React.Fragment key={room}>
          <ListItemButton
            key={room}
            onClick={() => navigate(`/control/room/${room}`)}
          >
            <ListItemAvatar>
              <HouseIcon />
            </ListItemAvatar>
            <ListItemText>{room}</ListItemText>
          </ListItemButton>

          {devices.length > 0 && <DeviceList devices={devices} />}
        </React.Fragment>
      ))}
    </List>
  );
};

export const DeviceList = ({ devices }: { devices: Device[] }) => {
  const navigate = useNavigate();

  return (
    <>
      {devices.map((device) => (
        <ListItemButton
          key={device.id}
          sx={{ ml: 2 }}
          onClick={() => navigate(`/control/device/${device.id}`)}
        >
          {(device.program === "ledlights" || device.program === "rgbw") && (
            <ListItemAvatar>
              <LightbulbIcon />
            </ListItemAvatar>
          )}
          {device.program === "smartplug" && (
            <ListItemAvatar>
              <OutletIcon />
            </ListItemAvatar>
          )}
          {device.program === "goodvibes" && (
            <ListItemAvatar>
              <PowerIcon />
            </ListItemAvatar>
          )}
          <ListItemText>{device.id}</ListItemText>
        </ListItemButton>
      ))}
    </>
  );
};
