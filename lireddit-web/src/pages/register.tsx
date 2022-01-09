import React  from "react";
import {Formik, Form} from 'formik'
import { Box, Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { Wrapper } from "../components/Wrapper";
import { InputField } from "../components/InputField";
import { useMutation } from "urql";
import { useRegisterMutation } from "../generated/graphql";

interface registerProps {

}


const Register: React.FC<registerProps> = ({}) => {
    const [,register] = useRegisterMutation();
    return (
        <Wrapper variant="small">
        <Formik
          initialValues={{ username:"", password:"" }}
          //setErrors is a formik function
          onSubmit={async (values, { setErrors }) => {
              const response = await register(values);
              //? means optionals
              console.log(response.data)
              // if( response.data.register.errors){
              //   setErrors({
              //     username: "Error"
              //   })
              // }
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