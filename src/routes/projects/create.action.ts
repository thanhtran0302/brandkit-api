import { NextFunction, Request, Response } from 'express';
import { QueryResult } from 'pg';
import { v4 as uuidv4 } from 'uuid';
import { IProject, ProjectPayload } from '.';
import alertStyles from '../../constants/alertStyles';
import { pool } from '../../utils/database';
import { TokenProps } from '../../utils/helpers';

export async function shouldCreateProject(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { user }: Record<string, TokenProps> = res.locals;
  const { name }: ProjectPayload = req.body;

  try {
    const { rows }: QueryResult<IProject> = await pool.query<IProject>(
      'SELECT * FROM projects WHERE user_id = $1 AND name = $2',
      [user.userId, name]
    );

    if (!rows.length) {
      return next();
    }
    return res.status(400).send({ message: 'PROJECT_NAME_EXISTED' });
  } catch (error) {
    return res.status(500).send({ message: 'FAIL_GET_CREATION' });
  }
}

export async function createProject(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const projectId: string = uuidv4();
  const { name, description }: ProjectPayload = req.body;
  const currentDate: string = new Date().toISOString();

  try {
    await pool.query('INSERT INTO projects VALUES($1, $2, $3, $4, $5)', [
      projectId,
      res.locals.user.userId,
      name,
      description,
      currentDate,
    ]);
    res.locals = {
      ...res.locals,
      project: {
        id: projectId,
        name,
        description,
        creation_date: currentDate,
        update_date: null,
      },
    };
    return next();
  } catch (error) {
    return res.status(500).send({ message: 'FAIL_PROJECT_CREATION' });
  }
}

export async function initializeUIComponents(_req: Request, res: Response) {
  const componentId: string = uuidv4();
  const { project }: Record<string, IProject> = res.locals;

  try {
    await pool.query(
      'INSERT INTO ui_components VALUES($1, $2, $3, $4, $5, $6, $7)',
      [
        componentId,
        project?.id,
        alertStyles.name,
        alertStyles.description,
        new Date().toISOString(),
        alertStyles.primaryStyle,
        alertStyles.secondaryStyle,
      ]
    );

    return res.status(200).send({
      message: 'PROJECT_CREATED',
      project,
    });
  } catch (err) {
    return res.status(500).send({ message: 'FAIL_INITIALIZE_PROJECT' });
  }
}
