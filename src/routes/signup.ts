import bcrypt from 'bcrypt';
import express, { Request, Response } from 'express';
import { v1 as uuidv1, v4 as uuidv4 } from 'uuid';
import { pool } from '../utils/database';
import { Dictionary, objectToQueryInsert } from '../utils/query';

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

enum Plan {
  FREE = 'FREE',
  AGENCY = 'AGENCY',
  STARTUP = 'STARTUP'
}

router.route('/').post(async (req: Request, res: Response) => {
  const userId: string = uuidv4();
  const activationToken: string = uuidv1();
  const { email, password, confirm_password }: SignUpPayload = req.body;
  const hashPass = await bcrypt.hash(password, 12);

  if (password !== confirm_password) {
    return res.status(400).send({ message: SIGNUP.PSSWD_NOT_MATCH });
  }

  try {
    const query: Dictionary = {
      userId,
      email,
      hashPass,
      is_activated: false,
      create_date: new Date().toISOString(),
      activationToken,
      plan: Plan.FREE
    };
    await pool.query(`INSERT INTO users VALUES(${objectToQueryInsert(query)})`);
    return res.status(200).send({ message: SIGNUP.SUCCESS });
  } catch (error) {
    return res.status(500).send({
      message: SIGNUP.FAILED
    });
  }
});

module.exports = router;
