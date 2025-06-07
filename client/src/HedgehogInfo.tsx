import { Paper, Typography } from "@mui/material";

interface Props {
  hedgehogId: number | null;
}

export function HedgehogInfo({ hedgehogId }: Props) {
  console.log("HedgehogInfo component rendered with hedgehogId:", hedgehogId);
  return (
    <Paper
      elevation={3}
      sx={{
        margin: "1em 0em 1em 0em",
        padding: "1em",
      }}
    >
      <Typography>
        TODO: Esitä tässä komponentissa haluamallasi tavalla yksittäisen, tällä
        hetkellä valittuna olevan, siilin tiedot. Siili valitaan
        vasemmanpuoleisesta listauksesta. Kartalla esitetään valitun siilin
        sijainti karttamerkin avulla.
      </Typography>
      <br />
      <Typography>
        Komponentille välitetään React propertynä yksittäisen siilin ID, jonka
        muuttuessa ko. siilin tiedot haetaan rajapinnalta.
      </Typography>
      <br />
    </Paper>
  );
}
