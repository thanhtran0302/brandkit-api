import express, { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { pool } from '../utils/database';

const router = express.Router();

export interface PersonaProfilePayload {
  first_name?: string;
  last_name?: string;
  age?: number;
  gender?: string;
  occupation?: string;
  education?: string;
  personal_income?: number;
  household_income?: number;
  marital_status?: string;
  children?: number;
  personal_address?: string;
  work_address?: string;
  car_model?: string;
  interests?: string[];
  sports?: string[];
  values?: string[];
  clothing_brands?: string[];
  news_sources?: string[];
  music_types?: string[];
  social_platforms?: string[];
  pain_points?: string[];
  needs?: string[];
  challenges?: string[];
  beliefs?: string[];
  desires?: string[];
  fears?: string[];
  before_state_emotion?: string;
  after_state_emotion?: string;
}

export interface PersonaPayload {
  project_id: string;
  profile: PersonaProfilePayload;
}

router.route('/:personaId').get(async (req: Request, res: Response) => {
  const { personaId } = req.params;

  try {
    const { rows } = await pool.query('SELECT * FROM persona WHERE id = $1', [
      personaId
    ]);

    return res.status(200).send(rows);
  } catch (error) {
    return res.status(400).send({ message: 'FAIL_GET_PERSONA' });
  }
});

router.route('/').get(async (req: Request, res: Response) => {
  const { projectId } = req.query;

  try {
    const {
      rows
    } = await pool.query('SELECT * FROM persona WHERE project_id = $1', [
      projectId
    ]);

    return res.status(200).send(rows);
  } catch (error) {
    return res.status(400).send({ message: 'FAIL_GET_PERSONA' });
  }
});

router.route('/').post(async (req: Request, res: Response) => {
  const { project_id, profile }: PersonaPayload = req.body;
  const personaId: string = uuidv4();

  try {
    await pool.query('INSERT INTO persona VALUES($1, $2, $3)', [
      personaId,
      project_id,
      profile
    ]);
    return res.status(200).send({ message: 'SUCCESS_CREATE_PERSONA' });
  } catch (error) {
    return res.status(400).send({ message: 'FAILED_CREATE_PERSONA' });
  }
});

router.route('/:personaId').put(async (req: Request, res: Response) => {
  const { personaId } = req.params;

  try {
    await pool.query('UPDATE persona SET profile = $1 WHERE id = $2', [
      req.body,
      personaId
    ]);
    return res.status(200).send({ message: 'SUCCESS_MODIFY_PERSONA' });
  } catch (error) {
    return res.status(400).send({ message: 'FAIL_MODIFY_PERSONA' });
  }
});

router.route('/:personaId').delete(async (req: Request, res: Response) => {
  const { personaId } = req.params;

  try {
    await pool.query('DELETE FROM persona WHERE id = $1', [personaId]);
    return res.status(200).send({ message: 'SUCCESS_DELETE_PERSONA' });
  } catch (error) {
    return res.status(400).send({ message: 'FAIL_DELETE_PERSONA' });
  }
});

module.exports = router;
