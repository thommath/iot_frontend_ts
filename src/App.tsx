import { HashRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { FirmwarePage } from "./pages/firmware";
import { useAuth0 } from "@auth0/auth0-react";
import { LoginPage } from "./pages/login";
import { CircularProgress, ThemeProvider, createTheme } from "@mui/material";
import { AppContext } from "./contexts/AppContext";
import { useContext, useEffect, useState } from "react";
import { DevicesPage } from "./pages/devices";
import { TaskPage } from "./pages/tasks";
import { TokenContext } from "./contexts/TokenContext";

const lightTheme = createTheme({
  palette: {
    mode: "light",
  },
});
const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function App() {
  const { token } = useContext(TokenContext);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") !== "false"
  );
  useEffect(() => {
    localStorage.setItem("darkMode", String(darkMode));
  }, [darkMode]);

  if (!token) {
    return <CircularProgress />;
  }
  return (
    <AppContext.Provider value={{ token, darkMode, setDarkMode }}>
      <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
        <HashRouter>
          <Routes>
            <Route path="/" index Component={DevicesPage} />
            <Route path="/devices" Component={DevicesPage} />
            <Route path="/firmware" Component={FirmwarePage} />
            <Route path="/tasks" Component={TaskPage} />
          </Routes>
        </HashRouter>
      </ThemeProvider>
    </AppContext.Provider>
  );
}

export default App;
