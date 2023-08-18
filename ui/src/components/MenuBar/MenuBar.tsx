import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";

export default function MenuBar(props: { setIsLoggedIn: (isLoggedIn: boolean) => void }) {
  return (
      <AppBar position="static">
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <div></div> {/* Empty div to push the Log Out button to the right */}
        <Button 
          color="inherit"
          onClick={() => props.setIsLoggedIn(false)}
        >
          Log Out
        </Button>
      </Toolbar>
    </AppBar>
  )
}