import React from "react";
import { Container } from "@mui/material";
import bot from "../../images/reduced.png";
import Typography from '@mui/material/Typography';

export default function BotBase() {
  return (
    <Container maxWidth="xs">
      <div style={{ textAlign: "center", paddingTop: "20px", position: "relative" }}>
        <img src={bot} alt="bot" />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-93%, -166%)",
            width: "130px",
            height: "60px",
            textAlign: "center",
            color: "black",
            background: "#ffffff00",
            fontSize: "14px",
          }}
        >
          Welcome! Anything you'd like me to know?
        </div>
      </div>
    </Container>
  );
}
