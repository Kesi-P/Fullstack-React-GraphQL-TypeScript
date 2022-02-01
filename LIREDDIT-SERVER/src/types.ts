import { Connection, IDatabaseDriver } from "@mikro-orm/core";
import { Request, Response } from "express";
import { Redis } from "ioredis";
import { Session, SessionData } from "express-session";
import { EntityManager } from '@mikro-orm/mysql'
export type Mycontext = {
    em: EntityManager;
    req: Request & {
        session: Session & Partial<SessionData> & { userId: number };
      };
    res: Response;    
    redis: Redis;
}