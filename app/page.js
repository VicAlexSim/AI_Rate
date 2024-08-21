"use client";

import { useRouter } from "next/navigation";
import {
  AppBar,
  Container,
  Typography,
  Toolbar,
  Grid,
  Button,
  Box,
} from "@mui/material";

export default function Home() {
  const router = useRouter();
  const handleRoute = () => {
    console.log("Navigating to /professor");
    router.push("/professor");
  };

  return (
    <Container maxWidth="100vw">
      

      <Box sx={{ textAlign: "center", my: 4 }}>
        <Typography variant="h2">Welcome to ProfScore AI</Typography>
        <Button
          variant="contained"
          onClick={handleRoute}
          style={{
            backgroundColor: "#423E28",
          }}
        >
          Get started
        </Button>
      </Box>
    </Container>
  );
}
