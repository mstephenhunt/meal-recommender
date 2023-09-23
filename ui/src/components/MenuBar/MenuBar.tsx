import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import { useAuthService } from '../Login/auth.context';
import hat from '../../images/reduced-hat.png'
import { useNavigate } from "react-router-dom";

export default function MenuBar() {
  const authService = useAuthService();
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/home');
  };

  return (
    <AppBar position="static">
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <a href="/home" onClick={handleLogoClick}>
          <img src={hat} height={"45px"} alt="home" />
        </a>
        <Button
          sx={{
            backgroundColor: "white",
            color: "black",
          }}
          variant="contained"
          onClick={() => authService.logOut()}
        >
          Log Out
        </Button>
      </Toolbar>
    </AppBar>
  );
}
