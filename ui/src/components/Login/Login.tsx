import React, { useState, useEffect, useCallback } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [loginErrors, setLoginErrors] = useState<string[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [refreshTimeout, setRefreshTimeout] = useState<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const scheduleTokenRefresh = useCallback(() => {
    const refreshInterval = 60000; // 1 minute

    // Set the token refresh timeout
    const refreshTimeout = setTimeout(refreshToken, refreshInterval);

    // Save the timeout so we can clean it up later
    setRefreshTimeout(refreshTimeout);
  }, []);

  const setJwt = async (response: Response): Promise<void> => {
    const statusCode = response.status;
    const responseBody = await response.json();

    if (statusCode === 201) {
      // If the login was successful, save the JWT from the response into local storage
      const { jwt } = responseBody;
      localStorage.setItem("jwt", jwt);
    } else {
      throw new Error("An unknown error occurred. Please try again.");
    }
  }

  const refreshToken = async () => {
    try {
      const baseUrl = process.env.REACT_APP_API_URL;

      const response = await fetch(`${baseUrl}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: localStorage.getItem("jwt") }),
      });

      await setJwt(response);

      // Once refreshed, schedule the next token refresh
      scheduleTokenRefresh();
    } catch (error) {
      navigate("/");
    }
  };

  const handleSubmit = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    const baseUrl = process.env.REACT_APP_API_URL;

    const response = await fetch(`${baseUrl}/user/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: username, password }),
    });

    try {
      await setJwt(response);
      setIsLoggedIn(true);
      scheduleTokenRefresh();
      navigate("/home");
    } catch(error) {
      // @ts-ignore
      setLoginErrors([error.message]);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      // Register the initial token refresh timeout after login
      scheduleTokenRefresh();
    }
    
    // Clean up the timeout when the component unmounts or when the user logs out
    return () => {
      if (refreshTimeout) {
        clearTimeout(refreshTimeout);
      }
    };
  }, [isLoggedIn, refreshTimeout, scheduleTokenRefresh]);

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: "5px",
            }}
          >
            <LockOutlinedIcon sx={{ fontSize: "35px" }} />
            <Typography component="h1" variant="h4">
              Sign in
            </Typography>
          </Box>
        </div>
        <Box component="form" sx={{ width: "100%" }} onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoFocus
            onChange={handleUsernameChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            onChange={handlePasswordChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Log In
          </Button>
        </Box>
        {loginErrors.length > 0 && (
          <Box sx={{ width: "100%" }}>
            {loginErrors.map((error) => (
              <Typography
                key={error}
                variant="body1"
                sx={{ color: "red", textAlign: "center" }}
              >
                {error}
              </Typography>
            ))}
          </Box>
        )}
        <Link href="#" sx={{ textAlign: "right", width: "100%" }}>
          {"No account? Sign Up"}
        </Link>
      </Box>
    </Container>
  );
}