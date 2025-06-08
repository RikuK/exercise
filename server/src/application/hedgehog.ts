import { getPool } from "@server/db";
import { logger } from "@server/logging";
import { baseHedgehogSchema, hedgehogSchema, Hedgehog, HedgehogListItem, NewHedgehog } from "@shared/hedgehog";
import { sql } from "slonik";

export async function getAllHedgehogs(): Promise<readonly HedgehogListItem[]> {
  try {
    const hedgehogs = await getPool().any(
      sql.type(baseHedgehogSchema)`SELECT id, name FROM hedgehog_extended`
    );

    return hedgehogs || [];
  } catch (error) {
    logger.error(error);
    return [];
  }
}

export async function getHedgehogById(id: number): Promise<Hedgehog | null> {
  try {
    const hedgehog = await getPool().maybeOne(
      sql.type(hedgehogSchema)`
        SELECT 
          id, 
          name, 
          age, 
          sex,
          ARRAY[ST_Y(coordinates), ST_X(coordinates)] AS coordinates
        FROM hedgehog_extended
        WHERE id = ${id}
      `
    );

    return hedgehog;
  } catch (error) {
    logger.error(error);
    return null;
  }
}

export async function addHedgehog(newHedgehog: NewHedgehog): Promise<HedgehogListItem | null> {
  try {
    const inserted = await getPool().one(
      sql.type(baseHedgehogSchema)`INSERT INTO hedgehog_extended (name, age, sex, coordinates)
    VALUES (
      ${newHedgehog.name},
      ${newHedgehog.age},
      ${newHedgehog.sex},
      ST_SetSRID(ST_MakePoint(${newHedgehog.coordinates[0]}, ${newHedgehog.coordinates[1]}), 4326)
    ) RETURNING id, name`
    );

    return inserted;
  } catch (error) {
    logger.error(error);
    return null;
  }
}
