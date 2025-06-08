CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE hedgehog_extended (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  age INT NOT NULL CHECK (age >= 0),
  sex TEXT NOT NULL CHECK (sex IN ('male', 'female', 'unknown')),
  coordinates GEOMETRY(Point, 4326) NOT NULL
);
