import { Box, Paper, Typography, TextField, CircularProgress, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { Hedgehog } from "@shared/hedgehog";

interface Props {
  hedgehogId: number | null;
  setSelectedCoordinates: (coordinates: number[]) => void;
}

const sexLabelMap: Record<string, string> = {
  "": "Tuntematon",
  "male": "Uros",
  "female": "Naaras",
};

export function HedgehogInfo({ hedgehogId, setSelectedCoordinates }: Props) {
  const [hedgehog, setHedgehog] = useState<Hedgehog | null>(null);
  const [loading, setLoading] = useState(false);

  const getHedgehogById = async (id: number) => {
    try {
      if (!id) {
        return null;
      }
      const res = await fetch(`/api/v1/hedgehog/${id}`);

      if (!res.ok) {
        throw new Error(`Failed to fetch hedgehog with id ${id}`);
      }

      const json = await res.json();
      return json.hedgehog;
    } catch (error) {
      console.error("Error fetching hedgehog:", error);
      return null;
    }
  };

  const updateHedgehog = (hedgehog) => {
    setHedgehog(hedgehog);
    setSelectedCoordinates(hedgehog.coordinates ?? []);
  }

  useEffect(() => {
    if (hedgehogId) {
      setLoading(true);
      getHedgehogById(hedgehogId)
        .then(updateHedgehog)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
      setHedgehog(null);
    }
  }, [hedgehogId]);

  return (
    <Paper
      elevation={3}
      sx={{
        margin: "1em 0em 1em 0em",
        padding: "1em",
      }}
    >
      <Box display="flex" flexDirection="column" gap={2}>
        <Typography variant="h6">Havainnon tiedot</Typography>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <CircularProgress />
          </Box>
        ) : !hedgehog ? (
          <Typography variant="body1">Valitse rekisteröity siili nähdäksesi lisätiedot</Typography>
        ) : <>
          <TextField label="Nimi" value={hedgehog?.name ?? ""} InputProps={{ readOnly: true }} />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField label="Ikä" value={hedgehog?.age ?? "0"} InputProps={{ readOnly: true }} />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Sukupuoli" value={sexLabelMap[hedgehog?.sex ?? ""]} InputProps={{ readOnly: true }} />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Latitude"
                value={hedgehog?.coordinates?.[1] ?? ""}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Longitude"
                value={hedgehog?.coordinates?.[0] ?? ""}
                InputProps={{ readOnly: true }}
              />
            </Grid>
          </Grid>
        </>}
      </Box>
    </Paper>
  );
}
