import { MikroORM } from "@mikro-orm/core";
import path from "path";
import { __prod__ } from "./constants";
import { Blog } from "./entities/Blog";

export default {
    migrations: {
        path: path.join(__dirname, "./migrations"),
        pattern: /^[\w-]+\d+\.[tj]s$/,
    },
    entities: [Blog],
    dbName: 'lireddit',
    password:'9324',
    type:'postgresql',
    debug: !__prod__,
} as Parameters<typeof MikroORM.init>[0];
