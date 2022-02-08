import { Collection, Entity, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";
import { Blog } from "./Blog";
import { Updoot } from "./Updoot";

@ObjectType()
@Entity()
export class User {
    @Field()
    @PrimaryKey()
    id!: number;

    @Field()
    @Property({ type: "text", unique:true})
    username!: string;

    @Field()
    @Property({ type: "text", unique:true})
    email!: string;

    @Property({ type: "text"})
    password!: string;

    @OneToMany(() => Blog, blog => blog.creator)
    blog = new Collection<Blog>(this);

    @OneToMany(() => Updoot, updoot => updoot.user)
    updoots = new Collection<Updoot>(this);

    @Field( () => String)
    @Property({ type: "date"})
    createdAt = new Date();

    @Field( () => String)
    @Property({ type: "date" ,onUpdate: () => new Date( )})
    updatedAt = new Date();
}