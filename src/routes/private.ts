import express, { Request, Response } from 'express';

const router = express.Router();

router.route('/').get(async (_req: Request, res: Response) => {
  res.status(200).send({ ok: 'ok' });
});

module.exports = router;
