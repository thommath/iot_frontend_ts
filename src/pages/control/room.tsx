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

type ListResponse = {
  clients: string[];
  machines: string[];
  users: string[];
};

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

  const { callRpc } = useRpc({
    sendMessage: send,
    lastJsonMessage: message,
  });
  const [activeClients, setActiveClients] = useState<string[]>([]);
  const [loadingRpc, setLoadingRpc] = useState(false);
  const [errorRpc, setErrorRpc] = useState<string | null>(null);

  useEffect(() => {
    setLoadingRpc(true);
    callRpc({}, "listClients")
      .then((result: RpcResult<ListResponse>[]) => {
        if (!result || !result[0] || result[0].status !== "fulfilled") {
          console.error("No result from list");
          return;
        }
        const res = result[0].value;
        const clients = res.clients;
        setActiveClients(clients);
        setLoadingRpc(false);
      })
      .catch((error: any) => {
        console.error(error);
        setErrorRpc(error);
        setLoadingRpc(false);
      });
  }, []);

  const Container = useCallback(
    ({ children }: { children: ReactNode }) => (
      <Page title={`Room: ${id}`}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link
            underline="hover"
            color="inherit"
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
        <DeviceList devices={clientList} />
      </List>
      {clientList.some(
        (device) => device.program === "ledlights" || device.program === "rgbw"
      ) && <Light room={id} />}
    </Container>
  );
};
