import { Box, Button } from '@chakra-ui/react';
import {Formik, Form} from 'formik'
import { withUrqlClient } from 'next-urql';
import router, { useRouter } from 'next/router';
import React from 'react'
import { InputField } from '../components/InputField';
import { Layout } from '../components/Layout';
import { useCreateBlogMutation, useMeQuery } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlCClient';
import { useIsAuth } from '../utils/useIsAuth';

const CreateBlog: React.FC<{}> = ({}) => {
    const router = useRouter()

    useIsAuth()
    const [, createBlog] = useCreateBlogMutation()
    return (
        <Layout variant='small'>
         <Formik
          initialValues={{ title:"", content:"" }}
          //setErrors is a formik function
          onSubmit={async (values, {setErrors}) => {
              const response = await createBlog({input: values})
              if (response.data.createBlog){                
                    router.push("/")
                }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <InputField 
                name="title"
                placeholder="Title"
                label="Title"
              />
              <Box mt={4} mb={4}>
              <InputField 
                textarea
                name="content"
                placeholder="content.."
                label="Body"
              />
              </Box>
              
              <Button type="submit" variantColor="teal" isLoading={isSubmitting} >Create Blog</Button>
            </Form>
          )}
        </Formik>
        </Layout>
    )
}

export default withUrqlClient(createUrqlClient)(CreateBlog)