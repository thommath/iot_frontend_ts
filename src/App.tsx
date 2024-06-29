import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { FirmwarePage } from "./pages/firmware";
import { useAuth0 } from "@auth0/auth0-react";
import { LoginPage } from "./pages/login";
import { CircularProgress } from "@mui/material";
import { AppContext } from "./contexts/AppContext";
import { useEffect, useState } from "react";


function App() {
  const { isLoading, error, isAuthenticated, getAccessTokenSilently } =
    useAuth0();
  const [token, setToken] = useState<string | null>(null);
  const [tokenError, setTokenError] = useState<string | null>(null);


  useEffect(() => {
    if (isAuthenticated) {
      (async () => {
        try {
          const token = await getAccessTokenSilently({
            authorizationParams: {
              audience: "https://iot.mashaogthomas.no", // Value in Identifier field for the API being called.
            },
          });
          setToken(token);
        } catch (error) {
          console.error(error);
          setTokenError(String(error));
        }
      })();
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  if (error) {
    console.error(error);
    return <div>Error: {error.name}</div>;
  }
  if (tokenError) {
    return <div>Error: {tokenError}</div>;
  }

  if (isLoading) {
    return <CircularProgress />;
  }
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  if (!token) {
    return <CircularProgress />;
  }
  return (
    <AppContext.Provider value={{ token }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" Component={null} />
          <Route path="/firmware" Component={FirmwarePage} />
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  );
}

export default App;
