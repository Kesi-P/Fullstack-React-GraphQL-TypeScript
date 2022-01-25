import { Box, Button, Flex, Link } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import React from "react";
import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";
import { createUrqlClient } from "../utils/createUrqlCClient";
import NextLink from 'next/link'
import { useForgotPasswordMutation } from "../generated/graphql";
import { useState } from "react";

const forgotPassword: React.FC<{}> = ({}) => {
    const [ complete, setComplete] = useState(false)
    const [, forgotPassword] = useForgotPasswordMutation()  
    return (
        <Wrapper variant="small">
        <Formik
          initialValues={{email:"" }}
          //setErrors is a formik function
          onSubmit={async (values, {setErrors}) => {
            const response = await forgotPassword(values)
            if(response.data.forgotPassword === false){
                setErrors({email: "The Email is not registerd"})
            }
            else{
                setComplete(true)
            }
              
          }}
        >
          {({ isSubmitting }) => complete ? (<Box>Please check your inbox.</Box>) : (
            <Form>
              <Box mb={4}>
              <InputField 
                name="email"
                placeholder="email"
                label="Email"
                type="email"
              />
              </Box>
              
              <Button type="submit" variantColor="teal" isLoading={isSubmitting} >Send</Button>
            </Form>
          )}
        </Formik>
        </Wrapper>
      )
}

export default withUrqlClient(createUrqlClient)(forgotPassword)