import React, { useContext, useState } from 'react';
import Button from "../../components/Button";
import styled from 'styled-components';
import Form, { Field } from '@atlaskit/form';
import TextField from '@atlaskit/textfield';
import { Icon } from 'react-icons-kit';
import { google } from 'react-icons-kit/icomoon/google';
import AuthContext from '../../utils/context'

import AuthenticationLayout from '../../components/Layouts/Authentication';
import { resolve, reject } from 'q';



const GoogleButton = styled(Button)`
position: relative;
  background-color: #4949b3 !important;
  color: #fff;
  width: 100%;
`;

const MagicLinkButton = styled(Button)`
  margin-top: 16px;
  background-color: #43cad9 !important;
  width: 100%;
`;

const DarkHR = styled.hr`

  background: #dbdbdb;
  opacity: 1;
  box-shadow: none;
  outline: none;
  border: none;
  height: 1px;
`;

const LoginRegion = styled.div`
  display: grid;
  grid-template-areas: "." "." ".";
  grid-template-rows: 64px 5fr 1fr;
  height: ${props => props.height || '450px'};
  transition: height 250ms cubic-bezier(0.4, 0.0, 0.2, 1);


  > div:last-child {
    justify-content: center;
    display: flex;
    align-items: flex-end;
  }

`


const SignupForm = ({ onSubmit }) => {
  return (
    <Form
      onSubmit={onSubmit}
    >
      {({ formProps, submitting }) => (
        <form {...formProps} autoComplete="off">
          <Field name="email" defaultValue="" label="Email" isRequired>
            {({ fieldProps }) => <TextField {...fieldProps} />}
          </Field>
          <Field name="password" defaultValue="" label="Password" isRequired>
            {({ fieldProps }) => <TextField {...fieldProps} type="password" />}
          </Field>
          <Field name="confirmPassword" defaultValue="" label="Confirm Password" isRequired>
            {({ fieldProps }) => <TextField {...fieldProps} type="password" />}
          </Field>
          <MagicLinkButton type="submit" primary>
            <span>Create Account</span>
          </MagicLinkButton>
        </form>
      )}
    </Form>
  )
}

const SigninForm = ({ onSubmit }) => {
  return (
    <Form
      onSubmit={onSubmit}
    >
      {({ formProps, submitting }) => (
        <form {...formProps} autoComplete="off">

          <Field name="email" defaultValue="" label="Email" isRequired>
            {({ fieldProps }) => <TextField {...fieldProps} />}
          </Field>
          <Field name="password" defaultValue="" label="Password" isRequired>
            {({ fieldProps }) => <TextField {...fieldProps} type="password" />}
          </Field>
          <MagicLinkButton type="submit" primary>
            <span>Sign in</span>
          </MagicLinkButton>
        </form>
      )}

    </Form>
  )
}

const Login = ({ history }) => {
  const auth = useContext(AuthContext);
  const [signup, setSignup] = useState(false)

  if (auth.isAuthenticated()) {
    auth.handleRedirect();
  }

  const onLoginWithGoogle = auth.loginWithGoogle;

  const onLoginWithMagicLink = async (data) => {

    try {
      const res = await auth.passwordlessLogin(data.email);
      console.log(res)
    } catch (err) {
      console.error(err);
    }



  };

  const onUsernamePasswordSignin = async (data) => {
    throw new Error("nope")
  }

  return (
    <AuthenticationLayout>

      <LoginRegion height={signup ? '500px' : '450px'}>
        <div>
          <h1 style={{ height: "48px", marginTop: "16px" }}>
            {signup ? "Create a Diff account..." : "Login with a Diff account..."}
          </h1>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <GoogleButton onClick={onLoginWithGoogle}>
            <span>
              <Icon icon={google} className="leftIcon" />
              Sign in with Google
                  </span>
          </GoogleButton>


          <div style={{ marginTop: '32px' }}>
            <DarkHR />
          </div>

          <div>
            {signup && <SignupForm onSubmit={onLoginWithMagicLink} />}
            {!signup && <SigninForm onSubmit={onUsernamePasswordSignin} />}
          </div>

        </div>


        <div>
          {!signup && (
            <p>Don't have an account, <a href="#" onClick={() => setSignup(true)}>Create one now</a></p>

          )}
          {signup && (
            <p>Already have an account, <a href="#" onClick={() => setSignup(false)}>Sign in</a></p>

          )}
        </div>
      </LoginRegion>
    </AuthenticationLayout>
  )
}


export default Login;