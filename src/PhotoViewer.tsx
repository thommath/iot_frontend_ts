import { IconButton, Modal } from "@mui/material";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import "./PhotoViewer.css";
import CloseIcon from "@mui/icons-material/Close";
import { Photo } from "./Types";
import { useEffect } from "react";

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

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      console.log(e.key);
      if (e.key === "ArrowLeft") {
        changePage(-1);
      }
      if (e.key === "ArrowRight") {
        changePage(+1);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [changePage]);

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
      <div className="grid">
        <div className="grid-header">
          <IconButton sx={{ color: "azure" }} onClickCapture={() => onClose()}>
            <CloseIcon sx={{ fontSize: "2rem" }} />
          </IconButton>
        </div>
        <div className="grid-image">
          <img
            srcSet={`${photo.thumbnail_url}.s 240w, ${photo.thumbnail_url}.m 720w, ${photo.thumbnail_url}.l 1920w, ${photo.file_url} 2000w`}
            sizes="(max-width: 240px) 240px, (max-width: 720px) 720px, (max-width: 1920px) 1920px, 2000px"
            src={photo.file_url}
            className="photo"
            alt={photo.filename}
          />
        </div>
        <div className="grid-left">
          <IconButton
            sx={{ color: "azure" }}
            onClickCapture={() => changePage(-1)}
          >
            <KeyboardArrowLeftIcon sx={{ fontSize: "4rem" }} />
          </IconButton>
        </div>
        <div className="grid-right">
          <IconButton
            sx={{ color: "azure" }}
            onClickCapture={() => changePage(+1)}
          >
            <KeyboardArrowRightIcon sx={{ fontSize: "4rem" }} />
          </IconButton>
        </div>
      </div>
    </Modal>
  );
};
