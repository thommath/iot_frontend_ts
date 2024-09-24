import {
  Box,
  Breadcrumbs,
  CircularProgress,
  Link,
  Paper,
  Typography,
} from "@mui/material";
import { Page } from "../../components/Page";
import { ReactNode, useCallback, useContext } from "react";
import { TokenContext } from "../../contexts/TokenContext";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getDevice } from "../../api/iot_backend";
import useSharedWebSocket from "../../hooks/useWebsocket";
import { ReadyState } from "react-use-websocket";
import { Light } from "../../components/control/Light";

export const DevicePage = () => {
  // Get device id from path
  const { id } = useParams();

  console.log(id, btoa(id || ""));

  // Get device from id
  const { token } = useContext(TokenContext);
  const { data, error, isLoading } = useQuery({
    queryFn: () => getDevice({ token, id: id || "" }),
    queryKey: ["device", id],
    enabled: !!id,
  });
  const navigate = useNavigate();

  const { readyState } = useSharedWebSocket();

  const Container = useCallback(({ children }: { children: ReactNode }) => (
    <Page title={`Device: ${id}`}>
      <Breadcrumbs aria-label="breadcrumb">
        <Link
          underline="hover"
          color="inherit"
          onClick={() => navigate("/control")}
        >
          Control
        </Link>
        {data?.room && (
          <Link
            underline="hover"
            color="inherit"
            onClick={() => navigate(`/control/room/${data.room}`)}
          >
            {data.room}
          </Link>
        )}
        <Typography sx={{ color: "text.primary" }}>{id}</Typography>
      </Breadcrumbs>
      <Paper>{children}</Paper>
    </Page>
  ), [id, data]);

  if (error) {
    // Report error to mertics service
    console.error(error);
    return (
      <Container>
        <Typography>An error has occured, please send help.</Typography>
      </Container>
    );
  }
  if (isLoading || !data || readyState !== ReadyState.OPEN) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container>
      <Properties data={data || {}} />
      {(data.program === "ledlights" || data.program === "rgbw") && (
        <Light id={id} />
      )}
    </Container>
  );
};

type PropertiesProps = {
  data: Record<string, any>;
};

const Properties = ({ data }: PropertiesProps) => {
  return (
    <Box>
      <Typography variant="h5">Properties</Typography>
      <Box>
        {Object.entries(data).map(([key, value]) => (
          <Box key={key} sx={{ display: "flex", gap: "1rem" }}>
            <Typography variant="body1">{key}</Typography>
            <Typography variant="body2">{value}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
