import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { LoginPage } from "./pages/login";
import { TokenContext } from "./contexts/TokenContext";
import { LocalLoginPage } from "./pages/localLogin";

const localHosts = ["localhost:3000", "127.0.0.1", "iot.local.server"];
export const isLocal = localHosts.some(
  (host) => host === document.location.host
);

export const AuthProvider = ({ children }: any) => {
  if (isLocal) {
    return <LocalProvider>{children}</LocalProvider>;
  }
  return (
    <Auth0Provider
      domain="mashaogthomas.eu.auth0.com"
      clientId="WaScBj2g5J7KlO3vr9kU9XAzXhfogWm1"
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: "https://iot.mashaogthomas.no",
      }}
      cacheLocation="localstorage"
    >
      <AuthZeroProvider>{children}</AuthZeroProvider>
    </Auth0Provider>
  );
};

const AuthZeroProvider = ({ children }: any) => {
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
          setToken(`Bearer ${token}`);
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
  if (!isAuthenticated || !token) {
    return <LoginPage />;
  }

  return (
    <TokenContext.Provider value={{ token }}>{children}</TokenContext.Provider>
  );
};

const LocalProvider = ({ children }: any) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  useEffect(() => {
    localStorage.setItem("token", token ?? "");
  }, [token]);

  if (!token) {
    return <LocalLoginPage setToken={setToken} />;
  }

  return (
    <TokenContext.Provider value={{ token }}>{children}</TokenContext.Provider>
  );
};
