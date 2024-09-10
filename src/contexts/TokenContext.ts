import React from "react";

type TokenContext = {
    token: string;
}

export const TokenContext = React.createContext<TokenContext>({} as TokenContext);
