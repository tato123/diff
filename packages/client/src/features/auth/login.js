import React, { useContext, useState } from 'react';
import Button from "../../components/Button";
import styled from 'styled-components';
import Form, { Field, ErrorMessage } from '@atlaskit/form';
import TextField from '@atlaskit/textfield';
import { Icon } from 'react-icons-kit';
import { google } from 'react-icons-kit/icomoon/google';
import AuthContext from '../../utils/context'

import AuthenticationLayout from '../../components/Layouts/Authentication';
import { Link, Router } from 'react-router-dom';

import * as yup from 'yup';


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
  grid-template-rows: 64px 5fr 80px;
  height: ${props => props.height || '450px'};
  transition: height 250ms cubic-bezier(0.4, 0.0, 0.2, 1);


  > div:last-child {
    display: flex;
    justify-content: flex-end;
    flex: 1 auto;
    flex-direction: column;
    align-items: center;
  }

`

const schema = yup.object().shape({

  email: yup.string().email(),
  password: yup.string().min(8)

});

const validateEmail = value => {
  const result = schema.isValidSync({ email: value });
  if (result) {
    return;
  }
  return 'INVALID_EMAIL';
}

const validatePassword = value => {
  const result = schema.isValidSync({ password: value });
  if (result) {
    return;
  }
  return 'Password length must be 8 characters';
}

const SignupForm = ({ onSubmit }) => {
  return (
    <Form
      onSubmit={onSubmit}
    >
      {({ formProps, submitting }) => (
        <form {...formProps} autoComplete="off">
          <Field name="email" defaultValue="" label="Email" isRequired validate={validateEmail}>
            {({ fieldProps, error }) => <>
              <TextField {...fieldProps} />
              {error === 'INVALID_EMAIL' && (
                <ErrorMessage>A valid email address is required</ErrorMessage>
              )}
            </>}
          </Field>
          <Field name="password" defaultValue="" label="Password" isRequired validate={validatePassword}>
            {({ fieldProps, error }) =>
              <>
                <TextField {...fieldProps} type="password" />
                {error && <ErrorMessage>
                  <pre><code>{error}</code></pre></ErrorMessage>}

              </>}
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
      {({ formProps, submitting, error }) => (
        <form {...formProps} autoComplete="off">
          <Field name="email" defaultValue="" label="Email" isRequired validate={validateEmail}>
            {({ fieldProps, error }) => <>
              <TextField {...fieldProps} />
              {error === 'INVALID_EMAIL' && (
                <ErrorMessage>A valid email address is required</ErrorMessage>
              )}
            </>}
          </Field>
          <Field name="password" defaultValue="" label="Password" isRequired validate={validatePassword}>
            {({ fieldProps, error }) =>
              <>
                <TextField {...fieldProps} type="password" />
                {error && <ErrorMessage>
                  <pre><code>{error}</code></pre></ErrorMessage>}

              </>}
          </Field>
          <MagicLinkButton type="submit" primary>
            <span>Sign in</span>
          </MagicLinkButton>
        </form>
      )}

    </Form>
  )
}

/* eslint-disable jsx-a11y/anchor-is-valid */

const Login = ({ history }) => {
  const auth = useContext(AuthContext);
  const [signup, setSignup] = useState(false)

  if (auth.isAuthenticated()) {
    auth.handleRedirect();
  }

  const onLoginWithGoogle = auth.loginWithGoogle;

  // const onLoginWithMagicLink = async (data) => {

  //   try {
  //     const res = await auth.passwordlessLogin(data.email);
  //     console.log(res)
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };
  const onUsernamePasswordSignup = async (data) => {
    try {
      const res = await auth.signup(data.email, data.password);
      console.log(res);
    } catch (error) {
      console.error(error)
      return { password: error.policy }
    }
  }


  const onUsernamePasswordSignin = async (data) => {
    try {
      auth.loginWithEmail(data.email, data.password)
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <Router history={history}>
      <AuthenticationLayout>

        <LoginRegion height={signup ? '500px' : '500px'}>
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
              {signup && <SignupForm onSubmit={onUsernamePasswordSignup} />}
              {!signup && <SigninForm onSubmit={onUsernamePasswordSignin} />}
            </div>

          </div>


          <div>
            <div style={{ fontSize: '20px' }}>
              {!signup && (
                <p>Don't have an account, <a href="#" onClick={() => setSignup(true)}>Create one now</a></p>

              )}
              {signup && (
                <p>Already have an account, <a href="#" onClick={() => setSignup(false)}>Sign in</a></p>

              )}
            </div>
            <div style={{ marginTop: "16px" }}>
              <p>I agree to the <Link to="/privacy">privacy policy</Link> and <Link to="/tos">terms of service</Link></p>
            </div>
          </div>
        </LoginRegion>
      </AuthenticationLayout>
    </Router>
  )
}


export default Login;