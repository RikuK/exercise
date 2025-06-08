import { Box, MenuItem, Paper, Typography } from "@mui/material";
import { HedgehogListItem } from "@shared/hedgehog";


interface Props {
  hedgehogs: HedgehogListItem[];
  onSelect: (hedgehogId: number) => void;
  selected?: number | null;
}

export default function HedgeHogList({ hedgehogs, onSelect, selected }: Props) {
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
        <Box sx={{ overflowY: "auto", height: "100%" }}>
          {hedgehogs.map((hedgehog, index: number) => (
            <MenuItem
              key={`hedgehog-index-${index}`}
              selected={hedgehog.id === selected}
              onClick={() => {
                onSelect(hedgehog.id)
              }}
            >
              {hedgehog.name}
            </MenuItem>
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
