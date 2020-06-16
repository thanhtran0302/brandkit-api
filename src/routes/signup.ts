import bcrypt from 'bcrypt';
import express, { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { pool } from '../utils/database';

const router = express.Router();

enum SIGNUP {
  SUCCESS = 'SUCCESS_SIGNUP',
  FAILED = 'FAILED_SIGNUP',
  PSSWD_NOT_MATCH = 'PASSWORD_NOT_MATCH'
}

interface SignUpPayload {
  email: string;
  password: string;
  confirm_password: string;
}

router.route('/').post(async (req: Request, res: Response) => {
  const userId: string = uuidv4();
  const { email, password, confirm_password }: SignUpPayload = req.body;
  const hashPass = await bcrypt.hash(password, 12);

  if (password !== confirm_password) {
    return res.status(400).send({ message: SIGNUP.PSSWD_NOT_MATCH });
  }

  try {
    await pool.query(`INSERT INTO users VALUES($1, $2, $3, $4)`, [
      userId,
      email,
      hashPass,
      false
    ]);
    return res.status(200).send({ message: SIGNUP.SUCCESS });
  } catch (error) {
    return res.status(500).send({
      message: SIGNUP.FAILED
    });
  }
});

module.exports = router;
