import { MikroORM } from "@mikro-orm/core"
import console from "console";
import { COOKIE_NAME, __prod__ } from "./constants";
import microConfig from "./mikro-orm.config"
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./rersolvers/hello";
import { BlogResolver } from "./rersolvers/blog";
import { UserResolver } from "./rersolvers/user";
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';

import Redis from 'ioredis'

import session from 'express-session'
import { Mycontext } from "./types";
import cors from 'cors'



const main = async () => {
    const orm = await MikroORM.init(microConfig);  
    //database connection
    await orm.getMigrator().up();

    const app = express();
    
    const RedisStore = require('connect-redis')(session)
    const redis = new Redis()

    app.use(
        cors({
            origin:"http://localhost:3000",
            credentials: true,
            
        })
    )
    app.use(
        session({
            name: COOKIE_NAME,
            store: new RedisStore({ 
                client: redis,
                disableTouch: true    
            }),
            cookie: {
                maxAge: 1000* 60 * 60 *24, //one day
                httpOnly: true,
                sameSite: 'lax', //csrf
                //secure: __prod__ //only work on htpps
            },
            saveUninitialized: false,
            secret: 'mySecrete',
            resave: false,
            
            })
    )
        
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, BlogResolver, UserResolver],
            validate: false
        }),
        //using old version apollo
        plugins: [
            ApolloServerPluginLandingPageGraphQLPlayground(),
          ],
        //to excess object, excess the seeion inside the resolver , this gonna send the arg to the resolver page
        context: ({ req, res }): Mycontext => ({ em: orm.em, req, res, redis })
    })
    //creata a graphql endpoint on express
    await apolloServer.start();
    apolloServer.applyMiddleware({ app,cors: false })
    app.listen(4000, () => {
        console.log('server started on loocalhost:4000')
    })
  
};

main().catch((err) => {
    console.error(err)
});