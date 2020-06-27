import bcrypt from 'bcrypt';
import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { QueryResult } from 'pg';
import { TOKEN_SECRET } from '../constants/global';
import { pool } from '../utils/database';

const router = express.Router();

enum LOGIN {
  SUCCESS = 'LOGIN_SUCCESS',
  FAIL = 'FAIL_LOGIN'
}

interface LoginPayload {
  email: string;
  password: string;
}

interface UserResult {
  id: string;
  email: string;
  password: string;
  is_activated: boolean;
  firstname?: string;
  lastname?: string;
}

router.route('/').post(async (req: Request, res: Response) => {
  const { email, password }: LoginPayload = req.body;

  try {
    const result: QueryResult<UserResult> = await pool.query<UserResult>(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );
    const { rows }: QueryResult<UserResult> = result;
    const [userResult] = rows;
    const token: string = jwt.sign(
      { email, userId: userResult.id },
      TOKEN_SECRET,
      {
        expiresIn: '30d'
      }
    );
    const isPasswordValid = await bcrypt.compare(password, userResult.password);
    if (!isPasswordValid) {
      return res.status(400).send({ message: LOGIN.FAIL });
    }

    if (isPasswordValid) {
      return res.status(200).send({
        message: LOGIN.SUCCESS,
        token
      });
    }
  } catch (error) {
    return res.status(400).send({
      message: LOGIN.FAIL
    });
  }
});

module.exports = router;
