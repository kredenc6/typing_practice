import { Box, Typography } from "@mui/material";
import { PuffLoader } from "react-spinners";

export default function Loading() {
  return (
    <Box sx={{ textAlign: "center", height: "100vh", display: "flex", justifyContent: "center", flexFlow: "wrap" }}>
      <Box sx={{ mt: "15vh", minHeight: "20rem", height: "60vh", display: "flex", flexFlow: "wrap", justifyContent: "center", alignItems: "flex-start" }}>
        <Typography variant="h2" sx={{ width: "100%" }}>Načítám...</Typography>
        <PuffLoader size={150} />
      </Box>
    </Box>
  );
}
