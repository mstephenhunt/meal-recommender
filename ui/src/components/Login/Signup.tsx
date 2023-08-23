import React, { useState } from "react";
import { Button, TextField } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { useNavigate } from "react-router-dom";
import { AuthService } from "./auth.service";

type SignupProps = {
  isSignupOpen: boolean;
  setIsSignupOpen: (isOpen: boolean) => void;
  authService: AuthService;
}

export default function Signup(input: SignupProps) {
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [passwordConfirmation, setPasswordConfirmation] = useState<string | null>(null);
  const [signupCode, setSignupCode] = useState<string | null>(null);
  const [signupErrors, setSignupErrors] = useState<string[]>([]);
  const { isSignupOpen, setIsSignupOpen, authService } = input;
  const navigate = useNavigate();

  function handleEmailChange(event: React.ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value);
  }

  function handlePasswordChange(event: React.ChangeEvent<HTMLInputElement>) {
    setPassword(event.target.value);
  }

  function handlePasswordConfirmationChange(event: React.ChangeEvent<HTMLInputElement>) {
    setPasswordConfirmation(event.target.value);
  }

  function handleSignupCodeChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSignupCode(event.target.value);
  }

  function handleSubmit() {
    async function submit() {
      if (!email || !password || !passwordConfirmation || !signupCode) {
        setSignupErrors(["Please fill out all fields"]);
        console.error("Please fill out all fields");
  
        return;
      }
  
      if (password !== passwordConfirmation) {
        setSignupErrors(["Passwords do not match"]);
        console.error("Passwords do not match");
  
        return;
      }
  
      try {
        await authService.signUp({
          email: email!,
          password: password!,
          signupCode: signupCode!,
        });
    
        navigate("/home");
      } catch (error) {
        console.error(error);
  
        setSignupErrors(["An unknown error ocurred"]);
      }
    }

    submit();
  }

  return (
    <div>
    <Dialog open={isSignupOpen} onClose={() => setIsSignupOpen(false)}>
    <DialogTitle>Sign Up</DialogTitle>
    <DialogContent>
      <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email"
          name="email"
          autoFocus
          type={"email"}
          onChange={handleEmailChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="signup-password"
          onChange={handlePasswordChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password-confirmation"
          label="Password Confirmation"
          type="password"
          id="signup-password-confirmation"
          onChange={handlePasswordConfirmationChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="signup-code"
          label="Signup Code"
          name="signup-code"
          onChange={handleSignupCodeChange}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          onClick={handleSubmit}
        >
          Sign Up
        </Button>
        {signupErrors.length > 0 && (
          <div>
            {signupErrors.map((error, index) => (
              <p key={index} style={{ color: "red", textAlign: "center" }}>
                {error}
              </p>
            ))}
          </div>
        )}
    </DialogContent>
    <DialogActions>
      <Button onClick={() => setIsSignupOpen(false)} color="primary">
        Close
      </Button>
    </DialogActions>
  </Dialog>
  </div>
  );
}
