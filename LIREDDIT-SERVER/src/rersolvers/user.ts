//schema is a grapsql query functions
import { User } from "../entities/User";
import { Mycontext } from "../types";
import { Resolver, Mutation, Arg, Ctx, InputType, Field, ObjectType, Query } from "type-graphql";
import passwordHash  from 'password-hash'
import { COOKIE_NAME } from "../constants";

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

    @Query(() => User, {nullable:true})
    async me(@Ctx() {req, em}: Mycontext){
        //not logged in
        //console.log(req.session )
        if( !req.session.userId){
            return null
        }
        const user = await em.findOne(User, {id: req.session.userId})
        return user
    }

    @Mutation(() => User)
    async register(
        @Arg('usernameinput') username:string,
        @Arg('passswordinput') password:string,
        @Ctx() {em, req}: Mycontext
        ) : Promise<User>
    {
        const hashPassword = await passwordHash.generate(password);
        const user = em.create(User, { username , password:hashPassword})
        await em.persistAndFlush(user);
        //also store user in the session same as logged in
        //set a cookie on the user
        req.session.userId = user.id;
        return user
    }

    @Mutation(() => UserResponse)
    async login(
        @Arg('options') options: UsernamePasswordInput,
        @Ctx() {em, req}: Mycontext
        ) : Promise<UserResponse>
    {
        const user = await em.findOne(User, {username: options.username})
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
        //! username gonna be definde
        //store userid in userId session
        req.session!.userId = user.id;
        console.log(req.session.userId )
        return { user }
    }

    @Mutation(() => Boolean)
    logout(@Ctx() {req, res}: Mycontext) {        
        return new Promise((resolve) =>
        req.session.destroy((err) => {
          res.clearCookie(COOKIE_NAME)
          
            if(err) {
                console.log(err);
                resolve(false);
                return
            }
            console.log("Cookie cleared");
            resolve(true)
        }))
    }
}