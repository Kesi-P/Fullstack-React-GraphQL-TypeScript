// Mikro-Orm Classes and Decorators
// Create column into the DB

import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";
import { User } from "./User";

@ObjectType()
@Entity()
export class Blog {
    @Field()
    @PrimaryKey()
    id!: number;

    @Field()
    @Property({ type: "text"})
    title!: string;

    @Field()
    @Property()
    content!: string;

    @Field()
    @Property({ default:0})
    point!: number;

    //the forienge id will create automatically * see blog-createblog

    @ManyToOne({ entity: () => User }) // or use options object
    creator: User;

    @Field( () => String)
    @Property({ type: "date"})
    createdAt = new Date();

    @Field( () => String)
    @Property({ type: "date" ,onUpdate: () => new Date( )})
    updatedAt = new Date();

}