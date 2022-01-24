import { Box, Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { NextPage } from 'next'
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { InputField } from '../../components/InputField';
import { Wrapper } from '../../components/Wrapper';
import { useChangePasswordMutation } from '../../generated/graphql';
import { createUrqlClient } from '../../utils/createUrqlCClient';
import { toErrorMap } from '../../utils/toErrorMap';

const ChangePassword: NextPage<{token: string}> = ({token}) => {
  const router = useRouter()
  const [, changePassword] = useChangePasswordMutation()
  const [tokenError, setTokenError] = useState('')
    return (
        <Wrapper variant="small">
        <Formik
          initialValues={{ newPassword: '' }}
          //setErrors is a formik function
          onSubmit={async (values, {setErrors}) => {
               const response = await changePassword({
                 newPassword: values.newPassword,
                 token
               });
             if (response.data?.changePassword.errors){
               const errorMap = toErrorMap(response.data.changePassword.errors);
                 if('token' in errorMap){
                   setTokenError(errorMap.token)
                 }
                 setErrors(errorMap)
             } else if (response.data?.changePassword.user){
                 router.push("/")
             }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <InputField 
                name="newPassword"
                placeholder="new password"
                label="New Password"
                type='password'
              />
              {tokenError ? <Box style={{ color: 'red'}}>{tokenError}</Box> : null}
              <Button  mt={4} type="submit" variantColor="teal" isLoading={isSubmitting} >Change Password</Button>
            </Form>
          )}
        </Formik>
        </Wrapper>
      )
}

ChangePassword.getInitialProps = ({query}) => {
    return {
        token: query.token as string
    }
}

export default withUrqlClient(createUrqlClient)(ChangePassword)