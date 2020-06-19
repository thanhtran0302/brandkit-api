import express, { Request, Response } from 'express';
import { QueryResult } from 'pg';
import { v4 as uuidv4 } from 'uuid';
import { pool } from '../utils/database';
import { objectToQuery } from '../utils/query';

const router = express.Router();

export interface VisionCreatePayload {
  project_id: string;
  name: string;
  description: string;
}

export interface Vision extends VisionCreatePayload {
  id: string;
}

router.route('/').post(async (req: Request, res: Response) => {
  const visionId: string = uuidv4();
  const { project_id, name, description } = req.body as VisionCreatePayload;

  try {
    const { rows }: QueryResult<Vision> = await pool.query<Vision>(
      'SELECT * FROM visions WHERE project_id = $1',
      [project_id]
    );

    if (rows.length === 0) {
      try {
        await pool.query('INSERT INTO visions keyS($1, $2, $3, $4)', [
          visionId,
          project_id,
          name,
          description
        ]);
        return res.status(200).send({ message: 'SUCCESS_CREATE_VISION' });
      } catch (error) {
        return res.status(400).send({ message: 'FAIL_CREATE_VISION' });
      }
    }
    throw new Error();
  } catch (error) {
    return res.status(400).send({ message: 'VISION_EXISTED' });
  }
});

router.route('/:visionId').get(async (req: Request, res: Response) => {
  const { visionId } = req.params;

  try {
    const { rows }: QueryResult<Vision> = await pool.query<Vision>(
      'SELECT * FROM visions WHERE id = $1',
      [visionId]
    );
    return res.status(200).send(rows[0] || {});
  } catch (error) {
    return res.status(400).send({ message: 'FAIL_GET_VISION' });
  }
});

router.route('/:visionId').delete(async (req: Request, res: Response) => {
  const { visionId } = req.params;

  try {
    await pool.query('DELETE FROM visions WHERE id = $1', [visionId]);
    return res.status(200).send({ message: 'SUCCESS_DELETE_VISION' });
  } catch (error) {
    return res.status(400).send({ message: 'FAIL_DELETE_VISION' });
  }
});

router.route('/:visionId').put(async (req: Request, res: Response) => {
  const { visionId } = req.params;

  try {
    await pool.query(
      `UPDATE visions SET ${objectToQuery(req.body)} WHERE id = $1`,
      [visionId]
    );
    return res.status(200).send({ message: 'SUCCUESS_MODIFY_VISION' });
  } catch (error) {
    return res.status(400).send({ message: 'FAIL_MODIFY_VISION' });
  }
});

module.exports = router;
