import { Connection, EntityManager, IDatabaseDriver } from "@mikro-orm/core";
import { Request, Response } from "express";
import { Redis } from "ioredis";

export type Mycontext = {
    em: EntityManager<IDatabaseDriver<Connection>>;
    req: Request;
    res: Response;    
    redis: Redis;
}