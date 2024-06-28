import React, { useCallback, useState } from "react";
import logo from "./logo.svg";
import { useQuery } from "@tanstack/react-query";
import { getAlbum } from "./api";
import {
  Box,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { Album } from "./Types";
import { PhotoViewer } from "./PhotoViewer";
import "./App.css";
import { formatTimestamp, parseTimestamp } from "./util";

function App() {
  const [openImageViewer, setOpenImageViewer] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { data, error, isLoading } = useQuery<Album>({
    queryFn: () => getAlbum({ albumId: "9qvhmckg" }),
    queryKey: ["albums"],
  });

  const photos = data?.photos;
  const changePage = useCallback(
    (changeAmount: number) => {
      if (!photos) return;
      setCurrentImageIndex(
        (i) => (photos.length + i + changeAmount) % photos.length
      );
    },
    [photos, setCurrentImageIndex]
  );

  const openImage = useCallback(
    (imageId: string) => {
      if (!photos) return;
      setCurrentImageIndex(photos.findIndex((photo) => photo.id === imageId));
      setOpenImageViewer(true);
    },
    [photos]
  );

  if (error) {
    // Report error to mertics service
    console.error(error);
    return (
      <Box>
        <Typography>An error has occured, please send help.</Typography>
      </Box>
    );
  }
  if (isLoading || !photos) {
    return <CircularProgress />;
  }

  return (
    <div className="App">
      <Typography variant="h2" marginBottom="2rem">
        {data.title}
      </Typography>

      <Grid container spacing={2} justifyContent="space-evenly">
        <Grid item>
          <Typography>Owner: {data.shareInfo.ownerFullName}</Typography>
        </Grid>
        <Grid item>
          <Typography>
            From {formatTimestamp(parseTimestamp(data.minCapturedDate))} to{" "}
            {formatTimestamp(parseTimestamp(data.maxCapturedDate))}
          </Typography>
        </Grid>
        <Grid item>
          <Typography>Contains {data.photos.length} images</Typography>
        </Grid>
      </Grid>

      <Grid container spacing={2} marginTop="2rem">
        {photos.map((photo) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={photo.id}>
            <img
              src={photo.thumbnail_url + ".s"}
              className="thumbnail"
              onClick={() => openImage(photo.id)}
            />
          </Grid>
        ))}
      </Grid>

      {openImageViewer && photos && (
        <PhotoViewer
          photos={photos}
          onClose={() => setOpenImageViewer(false)}
          changePage={changePage}
          currentImageIndex={currentImageIndex}
        />
      )}
    </div>
  );
}

export default App;
