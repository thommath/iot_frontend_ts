import { Grid, IconButton, Modal, Typography } from "@mui/material";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import "./PhotoViewer.css";
import CloseIcon from "@mui/icons-material/Close";
import { Photo } from "./Types";

type Props = {
  photos: Photo[];
  onClose: () => void;
  currentImageIndex: number;
  changePage: (changeAmount: number) => void;
};

export const PhotoViewer = ({
  photos,
  onClose,
  currentImageIndex,
  changePage,
}: Props) => {
  const photo = photos?.[currentImageIndex];

  if (!photo) {
    return null;
  }

  return (
    <Modal
      open={true}
      component={"div"}
      onClose={onClose}
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: "rgba(0, 0, 0, 0.95)",
            maxHeight: "100vh",
          },
        },
      }}
    >
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
          <Typography variant="body2">{photo.filename}</Typography>
          <IconButton sx={{ color: "azure" }} onClickCapture={() => onClose()}>
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
          <img src={photo.file_url} className="photo" />
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
