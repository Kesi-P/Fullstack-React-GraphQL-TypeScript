//schema is a grapsql query functions
import { User } from "../entities/User";
import { Mycontext } from "../types";
import { Resolver, Mutation, Arg, Ctx } from "type-graphql";
import passwordHash  from 'password-hash'



@Resolver()
export class UserResolver {
    @Mutation(() => User)
    async register(
        @Arg('usernameinput') username:string,
        @Arg('passswordinput') password:string,
        @Ctx() ctx: Mycontext
        ) : Promise<User>
    {
        const hashPassword = await passwordHash.generate(password);
        const user = ctx.em.create(User, { username , password:hashPassword})
        await ctx.em.persistAndFlush(user);
        return user
    }

    
}