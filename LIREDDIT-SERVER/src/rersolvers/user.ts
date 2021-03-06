//schema is a grapsql query functions
import { User } from "../entities/User";
import { Mycontext } from "../types";
import { Resolver, Mutation, Arg, Ctx, InputType, Field, ObjectType, Query, FieldResolver, Root } from "type-graphql";
import passwordHash  from 'password-hash'
import { COOKIE_NAME, FORGOT_PASSWORD } from "../constants";
import { sendEmail } from "../utils/sendEmail";
import { v4 } from 'uuid'

@InputType()
class UsernamePasswordInput {
    @Field()
    username: string;
    @Field()
    password: string;
    @Field()
    email: string;
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
@Resolver(User)
export class UserResolver {
    //only the owner can see thier email
    @FieldResolver(() => String)
    email(@Root() user: User, @Ctx() { req }: Mycontext){
        if(req.session.userId === user.id){
            return user.email
        }
        //onerther user
        return "";
    }
    @Mutation(() => UserResponse)
    async changePassword(
        @Arg('token') token: string,
        @Arg('newPassword') newPassword: string,
        @Ctx() {redis, em, req}: Mycontext
    ): Promise<UserResponse> {
        if (newPassword.length <= 2){
            return { errors:[
                {
                    field: 'newPassword',
                    message: 'Lenght must be greater than 2'
                }
            ]}
        }
        //checking if there is the right user by taking the token and checj on the redis.
        const key = FORGOT_PASSWORD + token
        const userId = await redis.get(key)
        if(!userId){
            return { errors:[
                {
                    field: 'token',
                    message: 'Try another token'
                }
            ]}
        }

        const user = await em.findOne(User, {id: parseInt(userId)})
        if(!user){
            return { errors:[
                {
                    field: 'token',
                    message: 'user no longer exists'
                }
            ]}
        }
        user.password = await passwordHash.generate(newPassword);
        await em.persistAndFlush(user)

        await redis.del(key)
        //log in user after change password
        req.session.userId = user.id
        return {user}
    }

    @Mutation(() => Boolean)
    async forgotPassword(@Arg("email") email:string,
    @Ctx() {em, redis}: Mycontext){
        const user = await em.findOne(User, {email});
        if(!user){
            //the email is not in DB
            return false
        }
        const token = v4();
        console.log(email)
        await redis.set(FORGOT_PASSWORD + token, user.id, 'ex', 1000*60*60*24*3) //3dys to set
        await sendEmail(
            email,
            `<a href="http://localhost:3000/change-password/${token}">Reset Password</a>`
        )
        return true
    }

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
        @Arg('emailinput') email:string,
        @Ctx() {em, req}: Mycontext
        ) : Promise<User>
    {
        const hashPassword = await passwordHash.generate(password);
        const user = em.create(User, { username , password:hashPassword, email})
        await em.persistAndFlush(user);
        //also store user in the session same as logged in
        //set a cookie on the user
        req.session.userId = user.id;
        return user
    }

    @Mutation(() => UserResponse)
    async login(
        @Arg('usernameOremail') usernameOremail: string,
        @Arg('password') password:string,
        @Ctx() {em, req}: Mycontext
        ) : Promise<UserResponse>
    {
        const user = await em.findOne(User, usernameOremail.includes('@') 
        ? { email : usernameOremail}
        : { username: usernameOremail})
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
        const validPass = await passwordHash.verify(password, user.password);
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