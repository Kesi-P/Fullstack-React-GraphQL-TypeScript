import React  from "react";
import {Formik, Form} from 'formik'
import { Box, Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { Wrapper } from "../components/Wrapper";
import { InputField } from "../components/InputField";
import { useMutation } from "urql";

interface registerProps {

}

const REGISTER_MUT = 
`mutation Register($username: String!, $password:String!){
  register(passswordinput:$password, usernameinput:$username){
    errors{
      field
      message
    }
    user{
      id
      username
    }
  }
}`

const Register: React.FC<registerProps> = ({}) => {
    const [,register] = useMutation(REGISTER_MUT)
    return (
        <Wrapper variant="small">
        <Formik
          initialValues={{ username:"", password:"" }}
          onSubmit={(values) => {
              return register(values)
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
              <Button type="submit" variantColor="teal" isLoading={isSubmitting} >Register</Button>
            </Form>
          )}
        </Formik>
        </Wrapper>
      )
}

export default Register;