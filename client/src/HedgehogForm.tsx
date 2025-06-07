import { Paper, Typography } from "@mui/material";
import { Hedgehog } from "@shared/hedgehog";

interface Props {
  coordinates: number[];
  onAdd: (hedgehog: Hedgehog) => void; // If you want to use the Hedgehog type 
}

export function HedgehogForm({ coordinates, onAdd }: Props) {
  console.log("Coordinates ", coordinates);

  const addHedgehog = async () => {
      try {
        const res = await fetch("/api/v1/hedgehog/add", {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: '{}'
        });
        if (!res.ok) return;

        const json = await res.json();
        onAdd(json.hedgehog); // Call the onAdd callback with the new hedgehog
      } catch (err) {
        console.error(`Error while fetching hedgehogs: ${err}`);
      }
    };

  return (
    <Paper
      elevation={3}
      sx={{
        margin: "1em 0em 1em 0em",
        padding: "1em",
      }}
    >
      <button
        onClick={() => {
          addHedgehog();
        }}
      >
        Lisää havainto
      </button>
      <Typography>
        TODO: Luo tähän lomake painikkeineen, jonka avulla uusia siilihavaintoja
        saa lisättyä palveluun.
      </Typography>
      <br />
      <Typography>
        Siililtä kysyttävät tiedot: nimi, ikä, sukupuoli. Lisäksi siilin
        havainnon yhteydessä merkitään havainnon sijainti kartalla. Kartalta
        saadaan koordinaattipiste tälle HedgehogForm:lle klikkaamalla karttaa
        (kts. consolin logit). Tämä koordinaattipiste tulee tallentaa
        tietokantaan muiden tietojen oheen. PostGIS tarjoaa koordinaateille
        sopivan tietokantatyypin koordinaattien tallennukseen. Yllä olevat
        tiedot tulee tallentaa tietokantaan sopivalla HTTP pyynnöllä siilien
        tietokantaan.
      </Typography>
    </Paper>
  );
}
