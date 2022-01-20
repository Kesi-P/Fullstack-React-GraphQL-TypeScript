import React  from "react";
import {Formik, Form} from 'formik'
import { Box, Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { Wrapper } from "../components/Wrapper";
import { InputField } from "../components/InputField";
import { useMutation } from "urql";
import { useRegisterMutation } from "../generated/graphql";
import { useRouter } from "next/router"
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlCClient";

interface registerProps {

}


const Register: React.FC<registerProps> = ({}) => {
    const router = useRouter();
    const [,register] = useRegisterMutation();
    return (
        <Wrapper variant="small">
        <Formik
          initialValues={{ username:"", password:"", email:"" }}
          //setErrors is a formik function
          onSubmit={async (values, {setErrors}) => {
              const response = await register(values);
              //? means optionals
              if(response.data?.register){
                router.push("/")
              }else{
                setErrors( {username: "The username is alredy taken"} )
              }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <InputField 
                name="username"
                placeholder="username"
                label="Username"
              />
              <Box mt={4} mb={4}>
              <InputField 
                name="email"
                placeholder="email"
                label="Email"
                type="email"
              />
              </Box>
              <Box mt={4} mb={4}>
              <InputField 
                name="password"
                placeholder="password"
                label="Password"
                type="password"
              />
              </Box>
              <Button type="submit" variantColor="teal" isLoading={isSubmitting} >Register</Button>
            </Form>
          )}
        </Formik>
        </Wrapper>
      )
}

export default withUrqlClient(createUrqlClient)(Register);