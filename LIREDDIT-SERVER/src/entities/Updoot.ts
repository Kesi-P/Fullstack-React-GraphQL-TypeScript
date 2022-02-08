// many to many
//user <-> blogs
//user -> join table <- blogs
//user -> updoot <- blogs
import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";
import { Blog } from "./Blog";
import { User } from "./User";

@ObjectType()
@Entity()
export class Updoot {  
    @Field()
    @PrimaryKey()
    id!: number;
    //the forienge id will create automatically * see blog-createblog
    @Field(() => User)
    @ManyToOne({ entity: () => User }) 
    user!: User;

    @Field(() => Blog)
    @ManyToOne({ entity: () => Blog }) 
    blog!: Blog;
    
    @Field()
    @Property({ type: "int"})
    value: number
}