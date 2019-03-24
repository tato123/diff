import React, { useContext } from 'react';
import Button from "../../components/Button";
import styled from 'styled-components';
import { Field } from '@atlaskit/form';
import TextField from '@atlaskit/textfield';
import Space from '../../components/Space'
import { Icon } from 'react-icons-kit';
import { google } from 'react-icons-kit/icomoon/google';
import AuthContext from '../../utils/context'

import AuthenticationLayout from '../../components/Layouts/Authentication';



const GoogleButton = styled(Button)`
position: relative;
  margin-top: 16px;
  background-color: #4949b3 !important;
  color: #fff;
  width: 100%;
`;

const MagicLinkButton = styled(Button)`
  margin-top: 16px;
  background-color: #43cad9 !important;
`;

const DarkHR = styled.hr`

  background: #dbdbdb;
  opacity: 1;
  box-shadow: none;
  outline: none;
  border: none;
  height: 1px;
`;




const Login = ({ history }) => {
  const auth = useContext(AuthContext);

  if (auth.isAuthenticated()) {
    auth.handleRedirect();
  }

  const onLoginWithGoogle = auth.loginWithGoogle;

  const onLoginWithMagicLink = evt => {
    evt.preventDefault();

    auth.passwordlessLogin(evt.target.email.value,
      (err, res) => {
        if (err) {
          console.error('an error occured', err);
          return;
        }

        console.log(res);
        // handle errors or continue
      }
    );

    return false;
  };

  return (
    <AuthenticationLayout>

      <div className="col right">
        <div>
          <p>Login to Diff</p>

        </div>

        <div>
          <form onSubmit={onLoginWithMagicLink}>
            <Field name="username" defaultValue="" label="User name" isRequired>
              {({ fieldProps }) => <TextField {...fieldProps} />}
            </Field>
            <Field name="password" defaultValue="" label="Password" isRequired>
              {({ fieldProps }) => <TextField {...fieldProps} />}
            </Field>

            <MagicLinkButton type="submit" primary>
              <span>Sign in</span>
            </MagicLinkButton>
          </form>
        </div>

        <div style={{ margin: '32px 0px' }}>
          <DarkHR />
        </div>

        <Space top={4}>
          <GoogleButton onClick={onLoginWithGoogle}>
            <span>
              <Icon icon={google} className="leftIcon" />
              Sign in with Google
                  </span>
          </GoogleButton>
        </Space>
      </div>
    </AuthenticationLayout>
  )
}


export default Login;