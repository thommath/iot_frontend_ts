import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { useQuery } from "@tanstack/react-query";
import { getAlbum } from "./api";
import { CircularProgress } from "@mui/material";
import { Album } from "./Types";
import { PhotoViewer } from "./PhotoViewer";

function App() {
  const [openImageViewer, setOpenImageViewer] = useState(true);

  const { data, error, isLoading } = useQuery<Album>({
    queryFn: () => getAlbum({ albumId: "9qvhmckg" }),
    queryKey: ["albums"],
  });

  const photos = data?.photos;

  return (
    <div className="App">
      <header className="App-header">
        <img
          src={logo}
          className="App-logo"
          alt="logo"
          onClick={() => setOpenImageViewer(true)}
        />
        <p onClick={() => setOpenImageViewer(true)}>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
      </header>

      {isLoading && <CircularProgress />}

      {openImageViewer && photos && (
        <PhotoViewer
          photos={photos}
          onClose={() => setOpenImageViewer(false)}
        />
      )}
    </div>
  );
}

export default App;
