import { MikroORM } from "@mikro-orm/core"
import console from "console";
import { __prod__ } from "./constants";
import microConfig from "./mikro-orm.config"
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./rersolvers/hello";
import { BlogResolver } from "./rersolvers/blog";
import { UserResolver } from "./rersolvers/user";

const main = async () => {
    const orm = await MikroORM.init(microConfig);  
    //database connection
    await orm.getMigrator().up();

    const app = express();
    
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, BlogResolver, UserResolver],
            validate: false
        }),
        //to excess object
        context: () => ({ em: orm.em})
    })
    //creata a graphql endpoint on express
    await apolloServer.start();
    apolloServer.applyMiddleware({ app })
    app.listen(4000, () => {
        console.log('server started on loocalhost:4000')
    })
  
};

main().catch((err) => {
    console.error(err)
});