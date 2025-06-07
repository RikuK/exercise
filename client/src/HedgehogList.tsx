import { Box, MenuItem, Paper, Typography } from "@mui/material";
import { Hedgehog } from "@shared/hedgehog";


interface Props {
  hedgehogs: Hedgehog[];
  onSelect: (hedgehogId: number) => void;
}

export default function HedgeHogList({ hedgehogs, onSelect }: Props) {

  return (
    <Paper elevation={3} sx={{ margin: "1em", overflow: "hidden" }}>
      <Box
        sx={{
          backgroundColor: "#a1e6df",
          height: "3em",
          display: "flex",
          zIndex: 2,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography sx={{ color: "darkslategrey" }}>
          Rekisteröidyt siilit
        </Typography>
      </Box>
      {hedgehogs.length ? (
        <Box sx={{ overflowY: "scroll", height: "100%" }}>
          {hedgehogs.map((hedgehog, index: number) => (
            <MenuItem key={`hedgehog-index-${index}`} onClick={() => onSelect(hedgehog.id)}>{hedgehog.id}</MenuItem>
          ))}
        </Box>
      ) : (
        <Typography sx={{ padding: "1em" }}>
          Ei rekisteröityjä siilejä
        </Typography>
      )}
    </Paper>
  );
}
