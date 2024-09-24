import {
  Breadcrumbs,
  CircularProgress,
  Link,
  List,
  Paper,
  Typography,
} from "@mui/material";
import { Page } from "../../components/Page";
import { ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { TokenContext } from "../../contexts/TokenContext";
import { useNavigate, useParams } from "react-router-dom";
import useSharedWebSocket from "../../hooks/useWebsocket";
import { ReadyState } from "react-use-websocket";
import { Light } from "../../components/control/Light";
import { DeviceList } from "../control";
import { getDevices } from "../../api/iot_backend";
import { useQuery } from "@tanstack/react-query";
import { RpcResult, useRpc } from "../../hooks/useRpc";
import { useActiveClients } from "../../hooks/useActiveClients";


export const RoomPage = () => {
  // Get device id from path
  const { id } = useParams();
  const { token } = useContext(TokenContext);
  const { readyState, send, message } = useSharedWebSocket();
  const { data, error, isLoading } = useQuery({
    queryFn: () => getDevices({ token }),
    queryKey: ["devices"],
  });
  const navigate = useNavigate();

  const { activeClients, loadingRpc, errorRpc } = useActiveClients();


  const Container = useCallback(
    ({ children }: { children: ReactNode }) => (
      <Page title={`Room: ${id}`}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link
            underline="hover"
            color="inherit"
            sx={{ cursor: "pointer" }}
            onClick={() => navigate("/control")}
          >
            Control
          </Link>
          <Typography sx={{ color: "text.primary" }}>{id}</Typography>
        </Breadcrumbs>
        {children}
      </Page>
    ),
    [id]
  );

  if (error || errorRpc) {
    // Report error to mertics service
    console.error(error);
    return (
      <Container>
        <Typography>An error has occured, please send help.</Typography>
      </Container>
    );
  }

  if (readyState !== ReadyState.OPEN || isLoading || loadingRpc) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  const clientList =
    data?.clients.filter(
      (d) => d.room === id && activeClients.includes(d.id)
    ) || [];
  return (
    <Container>
      <Typography variant="h6">Active clients</Typography>
      <List>
        <DeviceList devices={clientList} activeClients={activeClients} />
      </List>
      {clientList.some(
        (device) => device.program === "ledlights" || device.program === "rgbw"
      ) && <Light room={id} />}
    </Container>
  );
};
