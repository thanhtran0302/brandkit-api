import express, { NextFunction, Request, Response } from 'express';
import { QueryResult } from 'pg';
import { v4 as uuidv4 } from 'uuid';
import { pool } from '../utils/database';
import { UserSessionInfos } from '../utils/helpers';

const router = express.Router();

export interface ProjectPayload {
  name: string;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
}

async function shouldCreateProject(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { user }: UserSessionInfos = res.locals;
  const { name }: ProjectPayload = req.body;

  try {
    const { rows }: QueryResult<Project> = await pool.query<Project>(
      'SELECT * FROM projects WHERE user_id = $1 AND name = $2',
      [user.userId, name]
    );

    if (!rows.length) {
      return next();
    }
    return res.status(400).send({ message: 'PROJECT_NAME_EXISTED' });
  } catch (error) {
    return res.status(500).send({ message: 'FAIL_PROJECT_CREATION' });
  }
}

router
  .route('/')
  .post(shouldCreateProject, async (req: Request, res: Response) => {
    const projectId: string = uuidv4();
    const { name }: ProjectPayload = req.body;

    try {
      await pool.query('INSERT INTO projects VALUES($1, $2, $3)', [
        projectId,
        res.locals.user.userId,
        name
      ]);
      return res.status(200).send({ message: 'PROJECT_CREATED' });
    } catch (error) {
      return res.status(500).send({ message: 'FAIL_PROJECT_CREATION' });
    }
  });

router.route('/').get(async (_req: Request, res: Response) => {
  const {
    user: { userId }
  }: UserSessionInfos = res.locals;

  try {
    const {
      rows
    }: QueryResult<Project> = await pool.query(
      'SELECT * FROM projects WHERE user_id = $1',
      [userId]
    );
    return res.status(200).send(rows);
  } catch (error) {
    return res.status(500).send({
      message: 'FAIL_GET_PROJECTS'
    });
  }
});

router.route('/:projectId').get(async (req: Request, res: Response) => {
  const { projectId } = req.params;

  try {
    const { rows }: QueryResult<Project> = await pool.query<Project>(
      'SELECT * FROM projects WHERE id = $1',
      [projectId]
    );
    const [project]: Project[] = rows;

    return res.status(200).send(project);
  } catch (error) {
    return res.status(500).send({
      message: 'FAIL_EDIT_PROJECT'
    });
  }
});

router.route('/:projectId').put(async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const { name } = req.body;

  try {
    await pool.query('UPDATE projects SET name = $1 WHERE id = $2', [
      name,
      projectId
    ]);
    return res.status(200).send({
      message: 'SUCCESS_EDIT_PROJECT'
    });
  } catch (error) {
    return res.status(500).send({
      message: 'FAIL_EDIT_PROJECT'
    });
  }
});

router.route('/:projectId').delete(async (req: Request, res: Response) => {
  const { projectId } = req.params;

  try {
    await pool.query('DELETE FROM projects WHERE id = $1', [projectId]);
    return res.status(200).send({
      message: 'SUCCESS_DELETE_PROJECT'
    });
  } catch (error) {
    return res.status(500).send({
      message: 'FAIL_DELETE_PROJECT'
    });
  }
});

module.exports = router;
