import { HedgehogForm } from "./HedgehogForm";
import { HedgehogInfo } from "./HedgehogInfo";
import HedgeHogList from "./HedgehogList";
import { Map } from "./Map";
import { Box, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Hedgehog, HedgehogListItem } from "@shared/hedgehog";
import { fromLonLat } from 'ol/proj';
import { GeoJSON } from "ol/format";

export function App() {
  // Latest coordinates from the Map click event
  const [coordinates, setCoordinates] = useState<number[]>();
  // Selected hedgehog's coordinates
  const [selectedCoordinates, setSelectedCoordinates] = useState<number[]>();
  // ID of the currently selected hedgehog
  const [selectedHedgehogId, setSelectedHedgehogId] = useState<number | null>(
    null
  );
  const [hedgehogs, setHedgehogs] = useState<HedgehogListItem[]>([]);
  // Fetch all hedgehog's during startup
  useEffect(() => {
    const getAllHedgehogs = async () => {
      try {
        const res = await fetch("/api/v1/hedgehog");
        if (!res.ok) return;

        const json = await res.json();
        setHedgehogs(
          (json?.hedgehogs ?? []).map((h: Hedgehog): HedgehogListItem => ({
            id: h.id,
            name: h.name,
          })).sort((a: HedgehogListItem, b: HedgehogListItem) => a.id - b.id));
      } catch (err) {
        console.error(`Error while fetching hedgehogs: ${err}`);
      }
    };

    getAllHedgehogs();
  }, []);

  const handleAddHedgehog = (newHedgehog: HedgehogListItem) => {
    setHedgehogs(prev => [...prev, newHedgehog]);
    setSelectedHedgehogId(newHedgehog.id);
  };

  const handleCoordinatesChange = (coordinates: number[]) => {
    setSelectedCoordinates(coordinates);
  };

  const features: GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>[] = [];
  if (selectedCoordinates?.length === 2) {
    features.push({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: fromLonLat(selectedCoordinates),
      },
      properties: {
        color: "#00B2A0",
      },
    });
  }
  if (coordinates?.length === 2) {
    features.push({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: fromLonLat(coordinates),
      },
      properties: {
        color: "#b22222"
      }
    });
  }
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        justifyContent: "space-between",
      }}
    >
      <Box
        sx={{
          backgroundColor: "#00B2A0",
          height: "40px",
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography sx={{ color: "white" }} variant="overline">
          Siilit kartalla
        </Typography>
      </Box>
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "grid",
          gridAutoColumns: "1fr 1.5fr 2fr",
          gridAutoFlow: "column",
          overflow: "hidden",
        }}
      >
        <HedgeHogList hedgehogs={hedgehogs} onSelect={id => setSelectedHedgehogId(id)} selected={selectedHedgehogId} />
        <Box sx={{ overflow: 'auto' }}>
          <HedgehogInfo hedgehogId={selectedHedgehogId} setSelectedCoordinates={handleCoordinatesChange} />
          <HedgehogForm coordinates={coordinates || []} onAdd={handleAddHedgehog} updateCoordinates={setCoordinates} />
        </Box>
        <Paper elevation={3} sx={{ margin: "1em" }}>
          <Map
            onMapClick={(coordinates) => setCoordinates(coordinates)}
            features={features}
          />
        </Paper>
      </Box>
      <Box
        sx={{
          backgroundColor: "#00B2A0",
          height: "40px",
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {" "}
        <Typography sx={{ color: "white" }} variant="overline">
          Powered by Ubigu Oy
        </Typography>
      </Box>
    </Box>
  );
}
