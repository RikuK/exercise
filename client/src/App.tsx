import { HedgehogForm } from "./HedgehogForm";
import { HedgehogInfo } from "./HedgehogInfo";
import HedgeHogList from "./HedgehogList";
import { Map } from "./Map";
import { Box, Paper, Typography, Tabs, Tab } from "@mui/material";
import React, { useEffect, useState } from "react";
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
  const [tabIndex, setTabIndex] = useState(0);
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
    handleSelectedChange(newHedgehog.id);
  };

  const handleSelectedChange = (id: number) => {
    setSelectedHedgehogId(id);
    setTabIndex(1);
  };

  const handleMapClick = (coordinates: number[]) => {
    setCoordinates(coordinates);
    setTabIndex(0);
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
        <HedgeHogList hedgehogs={hedgehogs} onSelect={id => handleSelectedChange(id)} selected={selectedHedgehogId} />
        <Paper elevation={3} sx={{
          margin: "1em 0em 1em 0em",
          overflow: "auto"
        }}>
          <Tabs
            value={tabIndex}
            onChange={
              (_event: React.SyntheticEvent, newValue: number) => setTabIndex(newValue)
            }
            aria-label="hedgehog tabs"
            TabIndicatorProps={{ style: { display: 'none' } }}
            variant="fullWidth"
            sx={{
              '& button:not(.Mui-selected)': {
                backgroundColor: '#a1e6df',
                color: 'darkslategrey !important',
              },
              '& button.Mui-selected': {
                color: '#00B2A0 !important',
              },
            }}>
            <Tab label="Lisää uusi havainto" />
            <Tab label="Havainnon tiedot" />
          </Tabs>

          <Box>
            {tabIndex === 0 && (
              <HedgehogForm
                coordinates={coordinates || []}
                onAdd={handleAddHedgehog}
                updateCoordinates={setCoordinates}
              />
            )}

            {tabIndex === 1 && (
              <HedgehogInfo
                hedgehogId={selectedHedgehogId}
                setSelectedCoordinates={handleCoordinatesChange}
              />
            )}
          </Box>
        </Paper>
        <Paper elevation={3} sx={{ margin: "1em" }}>
          <Map
            onMapClick={handleMapClick}
            features={features}
          />
        </Paper>
      </Box >
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
    </Box >
  );
}
