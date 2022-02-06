import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Blog = {
  __typename?: 'Blog';
  content: Scalars['String'];
  createdAt: Scalars['String'];
  id: Scalars['Float'];
  point: Scalars['Float'];
  textSnippet: Scalars['String'];
  title: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type BlogInput = {
  content: Scalars['String'];
  title: Scalars['String'];
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  changePassword: UserResponse;
  createBlog: Blog;
  deleteBlog: Scalars['Boolean'];
  forgotPassword: Scalars['Boolean'];
  login: UserResponse;
  logout: Scalars['Boolean'];
  register: User;
  updateBlog: Blog;
};


export type MutationChangePasswordArgs = {
  newPassword: Scalars['String'];
  token: Scalars['String'];
};


export type MutationCreateBlogArgs = {
  input: BlogInput;
};


export type MutationDeleteBlogArgs = {
  inputid: Scalars['Float'];
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String'];
};


export type MutationLoginArgs = {
  password: Scalars['String'];
  usernameOremail: Scalars['String'];
};


export type MutationRegisterArgs = {
  emailinput: Scalars['String'];
  passswordinput: Scalars['String'];
  usernameinput: Scalars['String'];
};


export type MutationUpdateBlogArgs = {
  inputid: Scalars['Float'];
  titleinput?: InputMaybe<Scalars['String']>;
};

export type PaginatedBlog = {
  __typename?: 'PaginatedBlog';
  blogs: Array<Blog>;
  hasMore: Scalars['Boolean'];
};

export type Query = {
  __typename?: 'Query';
  blog?: Maybe<Blog>;
  blogs: PaginatedBlog;
  hello: Scalars['String'];
  me?: Maybe<User>;
};


export type QueryBlogArgs = {
  idinput: Scalars['Float'];
};


export type QueryBlogsArgs = {
  cursor?: InputMaybe<Scalars['String']>;
  limit: Scalars['Int'];
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['String'];
  email: Scalars['String'];
  id: Scalars['Float'];
  updatedAt: Scalars['String'];
  username: Scalars['String'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type RegularUserFragment = { __typename?: 'User', username: string, createdAt: string, id: number };

export type ChangePasswordMutationVariables = Exact<{
  token: Scalars['String'];
  newPassword: Scalars['String'];
}>;


export type ChangePasswordMutation = { __typename?: 'Mutation', changePassword: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null | undefined, user?: { __typename?: 'User', username: string, createdAt: string, id: number } | null | undefined } };

export type CreateBlogMutationVariables = Exact<{
  input: BlogInput;
}>;


export type CreateBlogMutation = { __typename?: 'Mutation', createBlog: { __typename?: 'Blog', id: number, title: string, content: string, point: number, createdAt: string, updatedAt: string } };

export type ForgotPasswordMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type ForgotPasswordMutation = { __typename?: 'Mutation', forgotPassword: boolean };

export type LoginMutationVariables = Exact<{
  usernameOremail: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null | undefined, user?: { __typename?: 'User', username: string, createdAt: string, id: number } | null | undefined } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type RegisterMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
  email: Scalars['String'];
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'User', username: string, createdAt: string, id: number } };

export type BlogsQueryVariables = Exact<{
  limit: Scalars['Int'];
  cursor?: InputMaybe<Scalars['String']>;
}>;


export type BlogsQuery = { __typename?: 'Query', blogs: { __typename?: 'PaginatedBlog', hasMore: boolean, blogs: Array<{ __typename?: 'Blog', id: number, title: string, textSnippet: string, point: number, createdAt: string, updatedAt: string }> } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'User', username: string, createdAt: string, id: number } | null | undefined };

export const RegularUserFragmentDoc = gql`
    fragment RegularUser on User {
  username
  createdAt
  id
}
    `;
export const ChangePasswordDocument = gql`
    mutation ChangePassword($token: String!, $newPassword: String!) {
  changePassword(token: $token, newPassword: $newPassword) {
    errors {
      field
      message
    }
    user {
      ...RegularUser
    }
  }
}
    ${RegularUserFragmentDoc}`;

export function useChangePasswordMutation() {
  return Urql.useMutation<ChangePasswordMutation, ChangePasswordMutationVariables>(ChangePasswordDocument);
};
export const CreateBlogDocument = gql`
    mutation createBlog($input: BlogInput!) {
  createBlog(input: $input) {
    id
    title
    content
    point
    createdAt
    updatedAt
  }
}
    `;

export function useCreateBlogMutation() {
  return Urql.useMutation<CreateBlogMutation, CreateBlogMutationVariables>(CreateBlogDocument);
};
export const ForgotPasswordDocument = gql`
    mutation ForgotPassword($email: String!) {
  forgotPassword(email: $email)
}
    `;

export function useForgotPasswordMutation() {
  return Urql.useMutation<ForgotPasswordMutation, ForgotPasswordMutationVariables>(ForgotPasswordDocument);
};
export const LoginDocument = gql`
    mutation Login($usernameOremail: String!, $password: String!) {
  login(usernameOremail: $usernameOremail, password: $password) {
    errors {
      field
      message
    }
    user {
      ...RegularUser
    }
  }
}
    ${RegularUserFragmentDoc}`;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
};
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;

export function useLogoutMutation() {
  return Urql.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument);
};
export const RegisterDocument = gql`
    mutation Register($username: String!, $password: String!, $email: String!) {
  register(
    passswordinput: $password
    usernameinput: $username
    emailinput: $email
  ) {
    ...RegularUser
  }
}
    ${RegularUserFragmentDoc}`;

export function useRegisterMutation() {
  return Urql.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument);
};
export const BlogsDocument = gql`
    query Blogs($limit: Int!, $cursor: String) {
  blogs(cursor: $cursor, limit: $limit) {
    hasMore
    blogs {
      id
      title
      textSnippet
      point
      createdAt
      updatedAt
    }
  }
}
    `;

export function useBlogsQuery(options: Omit<Urql.UseQueryArgs<BlogsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<BlogsQuery>({ query: BlogsDocument, ...options });
};
export const MeDocument = gql`
    query Me {
  me {
    ...RegularUser
  }
}
    ${RegularUserFragmentDoc}`;

export function useMeQuery(options: Omit<Urql.UseQueryArgs<MeQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<MeQuery>({ query: MeDocument, ...options });
};