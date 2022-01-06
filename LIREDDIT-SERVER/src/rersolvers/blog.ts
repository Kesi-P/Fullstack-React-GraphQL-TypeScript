//schema is a grapsql query functions
import { Blog } from "../entities/Blog";
import { Resolver, Query, Ctx, Arg, Mutation } from "type-graphql";
import { Mycontext } from "../types";

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
    async createBlog( 
        @Arg('titleinput' ) title:string,
        @Ctx() {em}: Mycontext) : Promise<Blog | null> {
        const blog = em.create(Blog, { title })
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