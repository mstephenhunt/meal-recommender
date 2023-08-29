import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import { useAuthService } from '../Login/auth.context';

export default function MenuBar() {
  const authService = useAuthService();

  return (
      <AppBar position="static">
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <div></div> {/* Empty div to push the Log Out button to the right */}
        <Button 
          color="inherit"
          onClick={() => authService.logOut()}
        >
          Log Out
        </Button>
      </Toolbar>
    </AppBar>
  )
}