import { MikroORM } from "@mikro-orm/core"
import console from "console";
import { __prod__ } from "./constants";
import { Blog } from "./entities/Blog";
import microConfig from "./mikro-orm.config"

const main = async () => {
    const orm = await MikroORM.init(microConfig);  
    await orm.getMigrator().up();
    // const blog = orm.em.create(Blog, {title: 'my first blog'});
    // await orm.em.persistAndFlush(blog)

    const blogs = await orm.em.find(Blog, {});
    console.log(blogs)
};

main().catch((err) => {
    console.error(err)
});