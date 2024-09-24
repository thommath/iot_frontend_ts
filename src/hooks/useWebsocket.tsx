import { useWebSocket } from "react-use-websocket/dist/lib/use-websocket";
import { useContext, useEffect } from "react";
import { TokenContext } from "../contexts/TokenContext";
import { isLocal } from "../AuthProvider";

const useSharedWebSocket = () => {
  const { token } = useContext(TokenContext);
  
  const { lastMessage, readyState, sendJsonMessage, sendMessage } =
    useWebSocket(
      isLocal
        ? "ws://ledlights.local.server/ws"
        : "wss://ledlights.mashaogthomas.no/ws",
      {
        protocols: [token.split(" ")[1].replaceAll("=", "")],
        shouldReconnect: () => true,
        reconnectAttempts: 99999,
        reconnectInterval: 1000,
        share: true,
      }
    );

  const send = (data: Record<string, any>) => {
    sendJsonMessage(data);
  };

  useEffect(() => {
    if (lastMessage?.data === "ping") {
      sendMessage("pong");
    }
  }, [lastMessage]);

  const message =
    lastMessage?.data === "ping"
      ? {}
      : JSON.parse((lastMessage?.data as null | string) || "{}");

  return { send, message, readyState };
};

export default useSharedWebSocket;
