import express, { Request, Response } from 'express';
import { QueryResult } from 'pg';
import { v4 as uuidv4 } from 'uuid';
import { pool } from '../utils/database';
import { objectToQuery } from '../utils/query';

const router = express.Router();

export interface MissionCreatePayload {
  project_id: string;
  name: string;
  description: string;
}

export interface Mission extends MissionCreatePayload {
  id: string;
}

router.route('/').post(async (req: Request, res: Response) => {
  const missionId: string = uuidv4();
  const { project_id, name, description } = req.body as MissionCreatePayload;

  try {
    await pool.query('INSERT INTO missions VALUES($1, $2, $3, $4)', [
      missionId,
      project_id,
      name,
      description
    ]);
    return res.status(200).send({ message: 'SUCCESS_CREATE_MISSION' });
  } catch (error) {
    return res.status(400).send({ message: 'FAIL_CREATE_MISSION' });
  }
});

router.route('/').get(async (req: Request, res: Response) => {
  const { projectId } = req.query;

  try {
    const { rows }: QueryResult<Mission> = await pool.query<Mission>(
      'SELECT * FROM missions WHERE project_id = $1',
      [projectId]
    );
    return res.status(200).send(rows);
  } catch (error) {
    return res.status(400).send({ message: 'FAIL_GET_MISSIONS' });
  }
});

router.route('/:missionId').get(async (req: Request, res: Response) => {
  const { missionId } = req.params;

  try {
    const { rows }: QueryResult<Mission> = await pool.query<Mission>(
      'SELECT * FROM missions WHERE id = $1',
      [missionId]
    );
    return res.status(200).send(rows[0] || {});
  } catch (error) {
    return res.status(400).send({ message: 'FAIL_GET_MISSION' });
  }
});

router.route('/:missionId').delete(async (req: Request, res: Response) => {
  const { missionId } = req.params;

  try {
    await pool.query('DELETE FROM missions WHERE id = $1', [missionId]);
    return res.status(200).send({ message: 'SUCCESS_DELETE_MISSION' });
  } catch (error) {
    return res.status(400).send({ message: 'FAIL_DELETE_MISSION' });
  }
});

router.route('/:missionId').put(async (req: Request, res: Response) => {
  const { missionId } = req.params;

  try {
    await pool.query(
      `UPDATE missions SET ${objectToQuery(req.body)} WHERE id = $1`,
      [missionId]
    );
    return res.status(200).send({ message: 'SUCCUESS_MODIFY_MISSION' });
  } catch (error) {
    return res.status(400).send({ message: 'FAIL_MODIFY_MISSION' });
  }
});

module.exports = router;
