import React, { useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useNavigate } from "react-router-dom";
import { AuthService } from "./auth.service";
import Signup from "./Signup";

export default function Login(props: { authService: AuthService }) {
  const [username, setUsername] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [loginErrors, setLoginErrors] = useState<string[]>([]);
  const [isSignupOpen, setIsSignupOpen] = useState(false); // State to control the modal
  const navigate = useNavigate();

  const { authService } = props;

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    try {
      await authService.logIn({
        username: username!,
        password: password!,
      });

      navigate("/home");
    } catch(error) {
      console.error(error);

      // @ts-ignore
      setLoginErrors([error.message]);
    }
  };

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
      <Link
        href="#"
        sx={{ textAlign: "right", width: "100%" }}
        onClick={() => setIsSignupOpen(true)} // Open the modal when the link is clicked
      >
        {"No account? Sign Up"}
      </Link>
      <Signup
        isSignupOpen={isSignupOpen}
        setIsSignupOpen={setIsSignupOpen}
      />
      </Box>
    </Container>
  );
}