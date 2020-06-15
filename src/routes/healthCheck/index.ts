import express, { Request, Response } from 'express';

const router = express.Router();

router
  .route('/')
  .get((_req: Request, res: Response) => res.status(200).json({ ok: 'ok' }));

module.exports = router;
