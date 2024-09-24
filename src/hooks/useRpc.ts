import { useEffect } from "react";

const rpcCalls: Record<number, { res: (result: any) => void, rej: (error: any) => void }> = {};

export type RpcResult<T> = {
    status: "fulfilled"
    value: T;
} | {
    status: "rejected";
    reason: any;
}

export type RpcResponse<T> = {
    jsonrpc: string;
    rpcid: number;
    result?: RpcResult<T>[];
    error?: any;
}

export function useRpc({
    sendMessage,
    lastJsonMessage,
}: {
    sendMessage: (message: Record<string, any>) => void;
    lastJsonMessage: { jsonrpc: string, rpcid: number, result?: any, error?: any } | null;
}) {
    useEffect(() => {
        if (!lastJsonMessage) {
            return;
        }
        if (!lastJsonMessage.rpcid) {
            return;
        }
        if (!(lastJsonMessage.rpcid in rpcCalls)) {
            console.warn("rpcid not in rpcCalls", lastJsonMessage.rpcid, Object.keys(rpcCalls))
            return;
        }
        if (lastJsonMessage.result) {
            rpcCalls[lastJsonMessage.rpcid]?.res(lastJsonMessage.result);
            return;
        }
        if (lastJsonMessage.error) {
            rpcCalls[lastJsonMessage.rpcid]?.rej(lastJsonMessage.error);
            return;
        }
    }, [lastJsonMessage]);

    const callRpc = async (to: Record<string, string | undefined>, method: string, params?: any): Promise<any> => {
        const rpcid = Math.random();
        sendMessage({
            jsonrpc: "2.0",
            rpcid,
            ...to,
            method,
            params,
        });
        const timeout = setTimeout(() => {
            if (rpcid in rpcCalls) {
                rpcCalls[rpcid].rej("timeout");
                delete rpcCalls[rpcid];
            }
        }, 5000);
        const response = await new Promise((res, rej) => {
            rpcCalls[rpcid] = {
                res, rej
            }
        });
        clearTimeout(timeout);
        return response;
    }
    return {
        callRpc,
    }
}
