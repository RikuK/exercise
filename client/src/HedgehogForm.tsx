import { HedgehogListItem } from "@shared/hedgehog";
import { useState, useEffect } from "react";
import { Box, TextField, Select, MenuItem, InputLabel, FormControl, Button } from '@mui/material';

interface Props {
  coordinates: number[];
  onAdd: (hedgehog: HedgehogListItem) => void; // If you want to use the Hedgehog type
  updateCoordinates: (coordinates: number[]) => void;
}

export function HedgehogForm({ coordinates, onAdd, updateCoordinates }: Props) {
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | ''>(0);
  const [sex, setSex] = useState('male');
  const [latitude, setLatitude] = useState<number | ''>(coordinates[1] || '');
  const [longitude, setLongitude] = useState<number | ''>(coordinates[0] || '');
  const [isValidateFields, setValidateFields] = useState<boolean>(false);

  useEffect(() => {
    setLatitude(coordinates[1]);
    setLongitude(coordinates[0]);
  }, [coordinates]);

  const updateMapCoordinates = (lat: number, lon: number) => {
    updateCoordinates([lon, lat]);
  };

  const addHedgehog = async () => {
    setValidateFields(true);
    if (!validateName(name) || !validateAge(age) || !validateLatitude(latitude) || !validateLongitude(longitude)) {
      return;
    }
    try {
      const res = await fetch("/api/v1/hedgehog/add", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          age,
          sex,
          coordinates: [Number(latitude), Number(longitude)] as [number, number],
        }),
      });
      if (!res.ok) return;

      const json = await res.json();
      onAdd(json.hedgehog); // Call the onAdd callback with the new hedgehog
      clearFields(); // Clear the form fields after successful addition
    } catch (err) {
      console.error(`Error while adding hedgehog: ${err}`);
    }
  };

  const clearFields = () => {
    setName('');
    setAge(0);
    updateCoordinates([]);
    setValidateFields(false);
  }

  const validateName = (name: string): boolean =>
    /^[A-Za-zÀ-ž ]{1,32}$/.test(name);

  const validateAge = (age: number | ''): boolean =>
    Number.isInteger(age) && +age >= 0 && +age <= 99;

  const validateLatitude = (lat: number | ''): boolean =>
    !isNaN(+lat) && +lat >= -90 && +lat <= 90;

  const validateLongitude = (lon: number | ''): boolean =>
    !isNaN(+lon) && +lon >= -180 && +lon <= 180;

  return (
    <Box sx={{
      padding: "1em",
    }}>
      <TextField
        fullWidth
        label="Nimi"
        value={name ?? ''}
        onChange={(e) => setName(e.target.value)}
        margin="normal"
        error={isValidateFields && !validateName(name)}
        helperText={isValidateFields && !validateName(name) && "Max length is 32 characters, only letters and spaces allowed."}
        required
      />

      <TextField
        fullWidth
        label="Ikä"
        type="number"
        value={age ?? 0}
        onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
        margin="normal"
        inputProps={{ min: 0, max: 99 }}
        error={isValidateFields && !validateAge(age)}
        required
      />

      <FormControl fullWidth margin="normal" required>
        <InputLabel
          id="sex-label"
          sx={{
            backgroundColor: 'white',
          }}
        >
          Sukupuoli
        </InputLabel>
        <Select
          labelId="sex-label"
          value={sex}
          label="Sex"
          onChange={(e) => setSex(e.target.value)}
        >
          <MenuItem value="male">Uros</MenuItem>
          <MenuItem value="female">Naaras</MenuItem>
          <MenuItem value="unknown">Tuntematon</MenuItem>
        </Select>
      </FormControl>

      <TextField
        fullWidth
        label="Latitude"
        type="number"
        value={latitude ?? ''}
        onChange={(e) => {
          updateMapCoordinates(Number(e.target.value), longitude || 0);
        }}
        margin="normal"
        inputProps={{ step: 'any', min: -90, max: 90 }}
        error={isValidateFields && !validateLatitude(latitude)}
        required
      />

      <TextField
        fullWidth
        label="Longitude"
        type="number"
        value={longitude ?? ''}
        onChange={(e) => {
          updateMapCoordinates(latitude || 0, Number(e.target.value));
        }}
        margin="normal"
        inputProps={{ step: 'any', min: -180, max: 180 }}
        error={isValidateFields && !validateLongitude(longitude)}
        required
      />

      <Button variant="contained" color="primary" type="submit" sx={{ mt: 2 }} onClick={addHedgehog} fullWidth>
        Lisää havainto
      </Button>
    </Box>
  );
}
