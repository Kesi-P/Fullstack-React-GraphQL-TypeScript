import React  from "react";
import {Formik, Form} from 'formik'
import { Box, Button , Flex, Link} from "@chakra-ui/react";
import { Wrapper } from "../components/Wrapper";
import { InputField } from "../components/InputField";
import { useLoginMutation } from "../generated/graphql";
import { useRouter } from "next/router"
import { toErrorMap } from "../utils/toErrorMap";
import { createUrqlClient } from "../utils/createUrqlCClient";
import { withUrqlClient } from "next-urql";
import NextLink from 'next/link'

const Login: React.FC<{}> = ({}) => {
    const router = useRouter();
    const [, login] = useLoginMutation();
    return (
        <Wrapper variant="small">
        <Formik
          initialValues={{ usernameOremail:"", password:"" }}
          //setErrors is a formik function
          onSubmit={async (values, {setErrors}) => {
              const response = await login(values);
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
                name="usernameOremail"
                placeholder="usernameOremail"
                label="Username or Email"
              />
              <Box mt={4} mb={4}>
              <InputField 
                name="password"
                placeholder="password"
                label="Password"
                type="password"
              />
              </Box>
              <Flex>
                <NextLink href='/forgot-password'>
                  <Link ml='auto'> Forget password</Link>
                </NextLink>
              </Flex>
              
              <Button type="submit" variantColor="teal" isLoading={isSubmitting} >Login</Button>
            </Form>
          )}
        </Formik>
        </Wrapper>
      )
}

export default withUrqlClient(createUrqlClient)(Login);