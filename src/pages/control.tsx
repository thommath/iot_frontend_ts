import {
  Box,
  CircularProgress,
  List,
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
import DeviceUnknownIcon from "@mui/icons-material/DeviceUnknown";
import { useNavigate } from "react-router-dom";
import { useActiveClients } from "../hooks/useActiveClients";

export const ControlPage = () => {
  const { token } = useContext(TokenContext);
  const { data, error, isLoading } = useQuery({
    queryFn: () => getDevices({ token }),
    queryKey: ["devices"],
  });
  const { activeClients, loadingRpc, errorRpc } = useActiveClients();

  if (error || errorRpc) {
    // Report error to mertics service
    console.error(error || errorRpc);
    return (
      <Page title="Control">
        <Paper>
          <Typography>An error has occured, please send help.</Typography>
        </Paper>
      </Page>
    );
  }
  if (isLoading || !data || loadingRpc) {
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
      [device.room || "Without room"]: [
        ...(acc[device.room || "Without room"] || []),
        device,
      ],
    }),
    {}
  );

  return (
    <Page title="Control">
      <Paper>
        <RoomList rooms={rooms} activeClients={activeClients} />
      </Paper>
    </Page>
  );
};

type RoomListProps = {
  rooms: Record<string, Device[]>;
  activeClients: string[];
};

// Each room should be clickable to navigate to a control page for the room
// And it should list the devices in the room
// as a MUI list
const RoomList = ({ rooms, activeClients }: RoomListProps) => {
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

          {devices.length > 0 && (
            <DeviceList devices={devices} activeClients={activeClients} />
          )}
        </React.Fragment>
      ))}
    </List>
  );
};

export const DeviceList = ({
  devices,
  activeClients,
}: {
  devices: Device[];
  activeClients: string[];
}) => {
  const navigate = useNavigate();

  const color = (id: string) =>
    activeClients.includes(id) ? "primary" : "secondary";

  const Icon = (id: string) => {
    switch (devices[0].program) {
      case "ledlights":
      case "rgbw":
        return <LightbulbIcon color={color(id)} />;
      case "smartplug":
        return <OutletIcon color={color(id)} />;
      case "goodvibes":
        return <PowerIcon color={color(id)} />;
      default:
        return <DeviceUnknownIcon color={color(id)} />;
    }
  };

  return (
    <>
      {devices.map((device) => (
        <ListItemButton
          key={device.id}
          sx={{ ml: 2 }}
          onClick={() => navigate(`/control/device/${device.id}`)}
        >
          <ListItemAvatar>{Icon(device.id)}</ListItemAvatar>
          <ListItemText>{device.id}</ListItemText>
        </ListItemButton>
      ))}
    </>
  );
};
