import { Mycontext } from "../types"
import { MiddlewareFn } from "type-graphql"

//run before resolver
export const isAuth: MiddlewareFn<Mycontext> = ({ context }, next) => {
    if(!context.req.session.userId) {
        throw new Error('Please log in')
    }

    return next()
}