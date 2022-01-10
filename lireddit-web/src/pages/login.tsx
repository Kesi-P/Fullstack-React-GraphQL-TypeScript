import React  from "react";
import {Formik, Form} from 'formik'
import { Box, Button } from "@chakra-ui/react";
import { Wrapper } from "../components/Wrapper";
import { InputField } from "../components/InputField";
import { useMutation } from "urql";
import { useLoginMutation } from "../generated/graphql";
import { useRouter } from "next/router"
import { toErrorMap } from "../utils/toErrorMap";

const Login: React.FC<{}> = ({}) => {
    const router = useRouter();
    const [, login] = useLoginMutation();
    return (
        <Wrapper variant="small">
        <Formik
          initialValues={{ username:"", password:"" }}
          //setErrors is a formik function
          onSubmit={async (values, {setErrors}) => {
              const response = await login({options: values});
             if (response.data?.login.errors){
                 setErrors(toErrorMap(response.data.login.errors))
             } else if (response.data?.login.user){
                 router.push("/")
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
                name="password"
                placeholder="password"
                label="Password"
                type="password"
              />
              </Box>
              <Button type="submit" variantColor="teal" isLoading={isSubmitting} >Login</Button>
            </Form>
          )}
        </Formik>
        </Wrapper>
      )
}

export default Login;