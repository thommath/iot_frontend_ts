import {
  AppBar,
  Box,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { ReactNode } from "react";
import ResponsiveAppBar from "./AppBar";

type Props = {
  title: string;
  children: ReactNode;
  titleEndSlot?: ReactNode;
};

export const Page = ({ title, children, titleEndSlot }: Props) => {
  return (
    <>
      <ResponsiveAppBar />
      <Paper sx={{ minHeight: "calc(100vh - 64px)", borderRadius: 0 }}>
        <Container>
          <Stack
            justifyContent="space-between"
            direction="row"
            alignItems="center"
          >
            <Box>
              <Typography variant="h2" fontSize="2rem" marginY="2rem">
                {title}
              </Typography>
            </Box>
            <Box>{titleEndSlot}</Box>
          </Stack>

          {children}
        </Container>
      </Paper>
    </>
  );
};
