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
  Paper,
} from "@mui/material";

export default function Home() {
  const router = useRouter();
  const handleRoute = () => {
    console.log("Navigating to /professor");
    router.push("/professor");
  };

  return (
    <Container maxWidth="100vw" sx={{ backgroundColor: "#A2A3BB", minHeight: "100vh", py: 4 }}>
      <AppBar position="static" elevation={0} sx={{ backgroundColor: "#000807", mb: 4 }}>
        <Toolbar>
          <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: "bold", color: "#FFF" }}>
            ProfScore AI
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Typography variant="h2" sx={{ fontWeight: "bold", color: "#000807", mb: 2 }}>
          Welcome to ProfScore AI
        </Typography>
        <Typography variant="h6" sx={{ color: "#000807", mb: 4 }}>
          Your AI-powered platform to enhance learning and teaching.
        </Typography>
        <Button
          variant="contained"
          onClick={handleRoute}
          sx={{
            backgroundColor: "#9395D3",
            color: "#FFF",
            fontSize: "1.2rem",
            padding: "10px 20px",
            borderRadius: "8px",
            "&:hover": {
              backgroundColor: "#B3B7EE",
            },
          }}
        >
          Get Started
        </Button>
      </Box>

      <Box sx={{ my: 6 }}>
        <Typography
          variant="h4"
          component="h2"
          gutterBottom
          sx={{ display: "flex", justifyContent: "center", color: "#000807", fontWeight: "bold" }}
        >
          Features
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, backgroundColor: "#FBF9FF", borderRadius: "12px" }}>
              <Typography variant="h6" component="h3" sx={{ fontWeight: "bold", mb: 2, color: "#000807" }}>
                Generative AI Responses
              </Typography>
              <Typography sx={{ color: "#666" }}>
                Automatically generate professors ratings using ChatGPT and accurate data from Ratemyprofessors.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, backgroundColor: "#FBF9FF", borderRadius: "12px" }}>
              <Typography variant="h6" component="h3" sx={{ fontWeight: "bold", mb: 2, color: "#000807" }}>
                Get informed before enrolling
              </Typography>
              <Typography sx={{ color: "#666" }}>
                Once you inform the AI where your planning in enrolling and what classes youre going to take it can give you detailed reviews based on prior students reviews. 
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, backgroundColor: "#FBF9FF", borderRadius: "12px" }}>
              <Typography variant="h6" component="h3" sx={{ fontWeight: "bold", mb: 2, color: "#000807" }}>
                Powered by OpenAI
              </Typography>
              <Typography sx={{ color: "#666" }}>
                Our system is built using the latest OpenAI model, ensuring that the responses are accurate and provide detailed information for incoming students.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}