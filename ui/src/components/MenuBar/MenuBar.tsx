import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import { AuthService } from "../Login/auth.service";

type MenuBarProps = {
  authService: AuthService;
};

export default function MenuBar(props: MenuBarProps) {
  return (
      <AppBar position="static">
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <div></div> {/* Empty div to push the Log Out button to the right */}
        <Button 
          color="inherit"
          onClick={() => props.authService.logOut()}
        >
          Log Out
        </Button>
      </Toolbar>
    </AppBar>
  )
}