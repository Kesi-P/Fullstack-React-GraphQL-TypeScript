import router from "next/router";
import { useEffect } from "react";
import { useMeQuery } from "../generated/graphql";

//if user not loggin yet
export const useIsAuth = () => {
    const [{data ,fetching}] = useMeQuery();
    useEffect(() => {
    if(!fetching && !data?.me){
        router.replace('/login')
    }
    }, [fetching, data])
}