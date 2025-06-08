import { Box, Paper, Typography, TextField, Grid, Skeleton } from "@mui/material";
import { useEffect, useState } from "react";
import { Hedgehog } from "@shared/hedgehog";

interface Props {
  hedgehogId: number | null;
  setSelectedCoordinates: (coordinates: number[]) => void;
}

const sexLabelMap: Record<string, string> = {
  "unknown": "Tuntematon",
  "male": "Uros",
  "female": "Naaras",
};

const loadingPlaceholder = () => {
  const textFieldPaceholder = () => (
    <Skeleton
      variant="rectangular"
      height={56}
      width="100%"
      animation="wave"
      sx={{
        '&::after': {
          animationDuration: '0.8s'
        },
      }}
    />
  );
  return (
    <>
      {textFieldPaceholder()}
      <Grid container spacing={2}>
        <Grid item xs={6}>
          {textFieldPaceholder()}
        </Grid>
        <Grid item xs={6}>
          {textFieldPaceholder()}
        </Grid>
        <Grid item xs={6}>
          {textFieldPaceholder()}
        </Grid>
        <Grid item xs={6}>
          {textFieldPaceholder()}
        </Grid>
      </Grid>
    </>);
}

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

  const updateHedgehog = (hedgehog: Hedgehog) => {
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
        <Typography
          variant="h6"
          sx={{
            borderBottom: '3px solid #a1e6df'
          }}
        >
          Havainnon tiedot
        </Typography>
        {loading ? (
          loadingPlaceholder()
        ) : !hedgehog ? (
          <Typography variant="body1">Valitse rekisteröity siili nähdäksesi lisätiedot</Typography>
        ) : <>
          <TextField label="Nimi" value={hedgehog?.name ?? ""} InputProps={{ readOnly: true }} />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField label="Ikä" value={hedgehog?.age ?? "0"} InputProps={{ readOnly: true }} fullWidth />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Sukupuoli" value={sexLabelMap[hedgehog?.sex ?? ""]} InputProps={{ readOnly: true }} fullWidth />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Latitude"
                value={hedgehog?.coordinates?.[1] ?? ""}
                InputProps={{ readOnly: true }}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Longitude"
                value={hedgehog?.coordinates?.[0] ?? ""}
                InputProps={{ readOnly: true }}
                fullWidth
              />
            </Grid>
          </Grid>
        </>}
      </Box>
    </Paper>
  );
}
