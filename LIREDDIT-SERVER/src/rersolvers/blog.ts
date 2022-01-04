//schema is a grapsql query functions
import { Blog } from "../entities/Blog";
import { Resolver, Query, Ctx, Arg, Int, Mutation } from "type-graphql";
import { Mycontext } from "../types";

@Resolver()
export class BlogResolver {
    //define graphql type that gonna return
    @Query(() => [Blog])
    //define typescript type
    blogs( @Ctx() ctx: Mycontext) : Promise<Blog[]> {
        return ctx.em.find(Blog, {});
    }

    // findding a blog by taking id arg
    @Query(() => Blog, { nullable: true})
    blog( 
        @Arg('idinput' ) id:number,
        @Ctx() ctx: Mycontext) : Promise<Blog | null> {
        return ctx.em.findOne(Blog, { id });
    }

    //Mutation for creating updating serting deleting (Chaning server)
    @Mutation(() => Blog)
    async createBlog( 
        @Arg('titleinput' ) title:string,
        @Ctx() ctx: Mycontext) : Promise<Blog | null> {
        const blog = ctx.em.create(Blog, { title })
        await ctx.em.persistAndFlush(blog)
        return blog
    }

    @Mutation(() => Blog)
    async updateBlog( 
        @Arg('inputid') id:number,
        @Arg('titleinput' , () => String, {nullable:true}) title:string,
        @Ctx() ctx: Mycontext) : Promise<Blog | null> {
        const blog = await ctx.em.findOne(Blog, {id});
        if (!blog){
            return null
        }
        if (typeof title !== 'undefined'){
            blog.title = title;
            await ctx.em.persistAndFlush(blog)
        }
        return blog
    }

    @Mutation(() => Boolean)
    async deleteBlog( 
        @Arg('inputid') id:number,
        @Ctx() ctx: Mycontext) : Promise<Boolean> {
            await ctx.em.nativeDelete(Blog, {id})
            return true
      
    }
}