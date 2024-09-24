import { useEffect, useState } from "react";
import useSharedWebSocket from "./useWebsocket";
import { RpcResult, useRpc } from "./useRpc";

type ListResponse = {
    clients: string[];
    machines: string[];
    users: string[];
  };

export const useActiveClients = () => {
    const [activeClients, setActiveClients] = useState<string[]>([]);
    const [loadingRpc, setLoadingRpc] = useState(false);
    const [errorRpc, setErrorRpc] = useState<string | null>(null);
    const { readyState, send, message } = useSharedWebSocket();

    const { callRpc } = useRpc({
        sendMessage: send,
        lastJsonMessage: message,
    });
    useEffect(() => {
        setLoadingRpc(true);
        callRpc({}, "listClients")
            .then((result: RpcResult<ListResponse>[]) => {
                if (!result || !result[0] || result[0].status !== "fulfilled") {
                    console.error("No result from list");
                    return;
                }
                const res = result[0].value;
                const clients = res.clients;
                setActiveClients(clients);
                setLoadingRpc(false);
            })
            .catch((error: any) => {
                console.error(error);
                setErrorRpc(error);
                setLoadingRpc(false);
            });
    }, []);

    return {
        activeClients,
        readyState,
        loadingRpc,
        errorRpc,
    };
}