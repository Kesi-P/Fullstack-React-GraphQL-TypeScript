//schema is a grapsql query functions
import { User } from "../entities/User";
import { Mycontext } from "../types";
import { Resolver, Mutation, Arg, Ctx, InputType, Field, ObjectType } from "type-graphql";
import passwordHash  from 'password-hash'

@InputType()
class UsernamePasswordInput {
    @Field()
    username: string;
    @Field()
    password: string;
}

@ObjectType()
class FieldError{
    @Field()
    field: string;
    @Field()
    message: string;
}

@ObjectType()
class UserResponse {
    @Field(() => [FieldError], {nullable: true})
    errors?: FieldError[]

    @Field(() => User, {nullable: true})
    user?: User;
}
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

    @Mutation(() => UserResponse)
    async login(
        @Arg('options') options: UsernamePasswordInput,
        @Ctx() ctx: Mycontext
        ) : Promise<UserResponse>
    {
        const user = await ctx.em.findOne(User, {username: options.username})
        if (!user) {
            return {
                errors: [
                    {
                        field: "username",
                        message: "The user doesn't exist"
                    }
                ]
            }
        }
        const validPass = await passwordHash.verify(options.password, user.password);
        if (!validPass){
            return {
                errors: [
                    {
                        field: "password",
                        message: "The password isn't correct"
                    }
                ]
            }
        }
        return { user }
    }
}