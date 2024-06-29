import React from "react";
import { AppData } from "../types/AppContext";

export const AppContext = React.createContext<AppData>({} as AppData);
