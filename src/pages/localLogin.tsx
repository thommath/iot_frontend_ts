import { useState } from "react";
import { getDevices } from "../api/iot_backend";

type LocalLoginProps = {
  setToken: (token: string) => void;
};

export const LocalLoginPage = ({ setToken }: LocalLoginProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      // Base 64 encode username:password
      const token = `Basic ${btoa(`${username}:${password}`)}`;
      await getDevices({ token });
      setToken(token);
    } catch (error) {
      setError("Invalid username or password");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Username:
        <input
          type="text"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
      </label>
      <br />
      <label>
        Password:
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </label>
      <br />
      <button type="submit">Log in</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
};
