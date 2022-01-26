//schema is a grapsql query functions
import { Blog } from "../entities/Blog";
import { Resolver, Query, Ctx, Arg, Mutation, InputType, Field, UseMiddleware } from "type-graphql";
import { Mycontext } from "../types";
import { isAuth } from "../middleware/isAuth";

@InputType()
class BlogInput {
    @Field()
    title: string
    @Field()
    content:string
}

@Resolver()
export class BlogResolver {
    //define graphql type that gonna return
    @Query(() => [Blog])
    //define typescript type
    blogs( @Ctx() {em}: Mycontext) : Promise<Blog[]> {
        return em.find(Blog, {});
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