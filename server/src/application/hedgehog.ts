import { getPool } from "@server/db";
import { logger } from "@server/logging";
import { hedgehogSchema } from "@shared/hedgehog";
import { sql } from "slonik";

export async function getAllHedgehogs() {
  try {
    const hedgehogs = await getPool().any(
      sql.type(hedgehogSchema)`SELECT id FROM hedgehog`
    );

    return hedgehogs;
  } catch (error) {
    logger.error(error);
  }
}

// TODO: Yksittäisen siilin hakeminen tietokannasta ID:llä

// TODO: Yksittäisen siilin lisäämisen sovelluslogiikka
export async function addHedgehog() {
  try {
    const inserted = await getPool().one(
      sql.type(hedgehogSchema)`INSERT INTO hedgehog DEFAULT VALUES RETURNING id`
    );

    return inserted;
  } catch (error) {
    logger.error(error);
  }
}
