//schema is a grapsql query functions
import { Resolver, Query } from "type-graphql";

@Resolver()
export class HelloResolver {
    //what query will return
    @Query(() => String)
    hello(){
        return "hello worls"
    }
}