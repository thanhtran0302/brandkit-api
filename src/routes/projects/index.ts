import express, { Request, Response } from 'express';
import { QueryResult } from 'pg';
import { pool } from '../../utils/database';
import { UserSessionInfos, TokenProps } from '../../utils/helpers';
import {
  createProject,
  initializeUIComponents,
  shouldCreateProject,
} from './create.action';

const router = express.Router();

export interface ProjectPayload {
  name: string;
  description: string;
}

export interface IProject {
  id: string;
  name: string;
  description: string;
  creation_date: string;
  update_date: string | null;
}

export interface ProjectORM extends IProject {
  user_id: string;
}

router
  .route('/')
  .post(shouldCreateProject, createProject, initializeUIComponents);

router.route('/').get(async (_req: Request, res: Response) => {
  const {
    user: { userId },
  }: Record<string, TokenProps> = res.locals;

  try {
    const {
      rows,
    }: QueryResult<ProjectORM> = await pool.query(
      'SELECT * FROM projects WHERE user_id = $1',
      [userId]
    );
    const results: IProject[] = rows.map((project: ProjectORM) => {
      const { user_id, ...rest } = project;
      return rest;
    });

    return res.status(200).send(results);
  } catch (error) {
    return res.status(500).send({
      message: 'FAIL_GET_PROJECTS',
    });
  }
});

router.route('/:projectId').get(async (req: Request, res: Response) => {
  const { projectId } = req.params;

  try {
    const { rows }: QueryResult<IProject> = await pool.query<IProject>(
      'SELECT * FROM projects WHERE id = $1',
      [projectId]
    );
    const [project]: IProject[] = rows;

    return res.status(200).send(project);
  } catch (error) {
    return res.status(500).send({
      message: 'FAIL_EDIT_PROJECT',
    });
  }
});

router.route('/:projectId').put(async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const { name } = req.body;

  try {
    await pool.query('UPDATE projects SET name = $1 WHERE id = $2', [
      name,
      projectId,
    ]);
    return res.status(200).send({
      message: 'SUCCESS_EDIT_PROJECT',
    });
  } catch (error) {
    return res.status(500).send({
      message: 'FAIL_EDIT_PROJECT',
    });
  }
});

router.route('/:projectId').delete(async (req: Request, res: Response) => {
  const { projectId } = req.params;

  try {
    await pool.query('DELETE FROM projects WHERE id = $1', [projectId]);
    return res.status(200).send({
      message: 'SUCCESS_DELETE_PROJECT',
    });
  } catch (error) {
    return res.status(500).send({
      message: 'FAIL_DELETE_PROJECT',
    });
  }
});

module.exports = router;
