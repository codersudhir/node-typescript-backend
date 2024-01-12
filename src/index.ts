import express, { NextFunction, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';

import { config } from "dotenv";
import router from './routes';

config();

const PORT = process.env.PORT || 8080;

export const prisma = new PrismaClient();

const app = express();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // maximum 100 requests per windowMs
});

app.use(helmet());

app.use(cors());

app.use(express.json({
    limit: '50mb',
}));

app.use(limiter);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    return res.status(500).json({ error: 'Internal Server Error' });
});

app.use(router);

app.listen(PORT, () => console.log(`🚀 Server ready at: http://localhost:${PORT}`));
