//schema is a grapsql query functions
import { Blog } from "../entities/Blog";
import { Resolver, Query, Ctx, Arg, Mutation, InputType, Field, UseMiddleware, Int, FieldResolver, Root, ObjectType } from "type-graphql";
import { Mycontext } from "../types";
import { isAuth } from "../middleware/isAuth";
import { QueryOrder } from "@mikro-orm/core";

@InputType()
class BlogInput {
    @Field()
    title: string
    @Field()
    content:string
}

@ObjectType()
class PaginatedBlog{
    @Field(() => [Blog])
    blogs: Blog[]
    @Field()
    hasMore: boolean
}
@Resolver(Blog)
export class BlogResolver {
    @FieldResolver(() => String)
    textSnippet(@Root() root: Blog){
        return root.content.slice(0, 50)
    }
    //define graphql type that gonna return
    @Query(() => PaginatedBlog)
    //define typescript type
    async blogs( 
        @Arg("limit", () => Int ) limit:number,
        @Arg('cursor', ()=>String, {nullable: true}) cursor: string | null ,
        @Ctx() {em}: Mycontext) 
        : Promise< PaginatedBlog> {
         const realLimit = Math.min(50, limit);
         const realLimitPlusOne = realLimit + 1;
         const conn = em.getConnection()
         const knex = conn.getKnex();
                 
         const test = knex.raw(`select b.*,json_build_object(
             'id',u.id,'username',u.username,'email', u.email) creator from blog b left join public.user u on u.id = b."creator_id" `)
         const res = await em.getConnection().execute(test);
         const entities = res.map(a => em.map(Blog, a));
            
         return {blogs: entities.slice(0, realLimit), hasMore: entities.length === realLimitPlusOne }
    }

    // findding a blog by taking id arg
    @Query(() => Blog, { nullable: true})
    blog( 
        @Arg('idinput' ) id:number,
        @Ctx() {em}: Mycontext) : Promise<Blog | null> {
        return em.findOne(Blog, { id });
    }

    //Mutation for creating updating serting deleting (Chaning server)
    @Mutation(() => Blog)
    //gonna run middleware before the mutation
    @UseMiddleware(isAuth)
    async createBlog( 
        @Arg('input' ) input:BlogInput,
        @Ctx() {em, req}: Mycontext
        ) : Promise<Blog | null> {
        console.log(req.session.userId)
         //if user not log in
        if(!req.session.userId) {
            throw new Error('Please log in')
        }
        const blog = em.create(Blog, 
            {  ...input,
                creator: req.session.userId
            
            })
        await em.persistAndFlush(blog)
        return blog
    }

    @Mutation(() => Blog)
    async updateBlog( 
        @Arg('inputid') id:number,
        @Arg('titleinput' , () => String, {nullable:true}) title:string,
        @Ctx() {em}: Mycontext) : Promise<Blog | null> {
        const blog = await em.findOne(Blog, {id});
        if (!blog){
            return null
        }
        if (typeof title !== 'undefined'){
            blog.title = title;
            await em.persistAndFlush(blog)
        }
        return blog
    }

    @Mutation(() => Boolean)
    async deleteBlog( 
        @Arg('inputid') id:number,
        @Ctx() {em}: Mycontext) : Promise<Boolean> {
            await em.nativeDelete(Blog, {id})
            return true
      
    }
}