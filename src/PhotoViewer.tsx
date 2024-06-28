import { Grid, IconButton, Modal } from "@mui/material";
import { useCallback, useState } from "react";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import "./PhotoViewer.css";
import CloseIcon from "@mui/icons-material/Close";
import { Photo } from "./Types";

type Props = {
  photos: Photo[];
  onClose: () => void;
};

export const PhotoViewer = (props: Props) => {
  const [index, setIndex] = useState(0);

  const changePage = useCallback(
    (changeAmount: number) => {
      setIndex((i) => (props.photos.length + i + changeAmount) % props.photos.length);
    },
    [setIndex]
  );

  return (
    <Modal open={true} component={"div"} onClose={props.onClose}>
      <Grid
        container
        spacing={2}
        alignItems="space-between"
        sx={{
          width: "100%",
          height: "100%",
        }}
      >
        <Grid item xs={12} textAlign="right">
          <IconButton
            sx={{ color: "azure" }}
            onClickCapture={() => props.onClose()}
          >
            <CloseIcon sx={{ fontSize: "2rem" }} />
          </IconButton>
        </Grid>

        <Grid item xs={1} textAlign="center" alignSelf="center">
          <IconButton
            sx={{ color: "azure" }}
            onClickCapture={() => changePage(-1)}
          >
            <KeyboardArrowLeftIcon sx={{ fontSize: "4rem" }} />
          </IconButton>
        </Grid>

        <Grid item xs={10} textAlign="center" alignSelf="center">
          <img src={props.photos[index].file_url} className="image" />
        </Grid>

        <Grid item xs={1} textAlign="center" alignSelf="center">
          <IconButton
            sx={{ color: "azure" }}
            onClickCapture={() => changePage(+1)}
          >
            <KeyboardArrowRightIcon sx={{ fontSize: "4rem" }} />
          </IconButton>
        </Grid>

        <Grid item xs={12} textAlign="center"></Grid>
      </Grid>
    </Modal>
  );
};
