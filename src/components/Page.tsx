import { AppBar, Box, Container, Paper, Typography } from "@mui/material";
import { ReactNode } from "react";
import ResponsiveAppBar from "./AppBar";

type Props = {
  title: string;
  children: ReactNode;
};

export const Page = ({ title, children }: Props) => {
  return (
    <>
      <ResponsiveAppBar />
      <Container>
        <Typography variant="h2" fontSize="2rem" marginY="2rem">
          {title}
        </Typography>

        <Paper>{children}</Paper>
      </Container>
    </>
  );
};
