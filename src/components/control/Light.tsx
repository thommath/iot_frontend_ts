import { Grid, Paper, Slider, Typography } from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChromePicker, RGBColor } from "react-color";
import useSharedWebSocket from "../../hooks/useWebsocket";
import { RpcResult, useRpc } from "../../hooks/useRpc";

/**
 * Converts a hue value from 0..1 to a RGB component from 0..1
 * @param {number} p lower bound of the color segment
 * @param {number} q upper bound of the color segment
 * @param {number} t the hue value 0..1
 * @returns {number} the RGB component from 0..1
 */
function hueToRgb(p: number, q: number, t: number): number {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
}

/**
 * Converts a HSL color to RGB
 * @param {number} h hue value from 0..1
 * @param {number} s saturation value from 0..1
 * @param {number} l lightness value from 0..1
 * @returns {[number, number, number]} the RGB components from 0..255
 */
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hueToRgb(p, q, h + 1 / 3);
    g = hueToRgb(p, q, h);
    b = hueToRgb(p, q, h - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

/**
 * Debounces a function. The function will be called when no call to the
 * debounced function has been made for the specified timeout.
 * @param {Function} func the function to debounce
 * @param {number} timeout the timeout in ms
 * @returns {Function} the debounced function
 */
function debounce<T extends (...args: any[]) => any>(
  func: T,
  timeout = 300
): T {
  let timer: number | null = null;
  let f: T | null = null;
  let a: Parameters<T> | null = null;

  return ((...args: Parameters<T>) => {
    if (!timer) {
      timer = window.setTimeout(() => {
        if (f) {
          f(...(a || []));
        }
        timer = null;
      }, timeout);
    }
    f = func;
    a = args;
  }) as T;
}

const useDebounce = (callback: () => void) => {
  const ref = useRef<() => void>();

  useEffect(() => {
    ref.current = callback;
  }, [callback]);

  const debouncedCallback = useMemo(() => {
    const func = () => {
      ref.current?.();
    };

    return debounce(func, 250);
  }, []);

  return debouncedCallback;
};
type LightProps = {
  id?: string;
  room?: string;
  program?: string;
};

type LightState = {
  r: number;
  g: number;
  b: number;
  a: number;
  brightness: number;
};

export const Light = ({ id, room, program }: LightProps) => {
  const { send, message } = useSharedWebSocket();
  const { callRpc } = useRpc({
    sendMessage: send,
    lastJsonMessage: message,
  });

  const sendUpdate = (msg: string) => {
    send({ msg, id, room, program });
  };

  const [color, setColor] = useState<RGBColor>({ r: 0, g: 0, b: 0, a: 1 });
  const [brightness, setBrightness] = useState<number>(0);

  const updateColor = useDebounce(() => {
    sendUpdate(
      "c " +
        color.r +
        " " +
        color.g +
        " " +
        color.b +
        " " +
        Math.round((color.a || 0) * 255)
    );
  });

  useEffect(() => {
    callRpc({ id, room, program }, "getConfig")
      .then((result: RpcResult<LightState>[]) => {
        const firstSuccess = result?.find(
          (result) => result.status === "fulfilled"
        );
        if (!firstSuccess) {
          return;
        }
        const config = (firstSuccess as any).value;
        setBrightness(config.brightness);
        setColor({
          r: config.r,
          g: config.g,
          b: config.b,
          a: config.a,
        });
      })
      .catch(() => {
        console.warn("getConfig failed");
      });
  }, []);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            columnWidth: 2,
          }}
        >
          <Typography variant="h5">Color</Typography>
          <ChromePicker
            styles={{
              default: {
                picker: {
                  width: "auto",
                },
              },
            }}
            color={color}
            onChange={(c) => {
              updateColor();
              setColor(c.rgb);
            }}
          />
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            columnWidth: 2,
          }}
        >
          <Typography variant="h5">Brightness</Typography>
          <Slider
            min={0}
            max={255}
            defaultValue={64}
            value={brightness}
            onChange={(_, v) => {
              sendUpdate("b " + v);
              setBrightness(v as number);
            }}
          />
        </Paper>
      </Grid>
    </Grid>
  );
};
