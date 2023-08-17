import React from "react";
import { Container } from "@mui/material";
import bot from "../../images/reduced.png";

type BotBaseProps = {
  speechText: string;
}

export default function BotBase({ speechText }: BotBaseProps) {
  return (
    <Container maxWidth="xs">
      <div style={{ textAlign: "center", paddingTop: "20px", position: "relative" }}>
        <img src={bot} height={"300px"} width="350px" alt="bot" />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-93%, -192%)",
            width: "175px",
            height: "65px",
            textAlign: "center",
            color: "black",
            background: "#ffffff00",
            fontSize: "18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {speechText}
        </div>
      </div>
    </Container>
  );
}
