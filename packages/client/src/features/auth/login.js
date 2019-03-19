import React, { useContext } from 'react';
import Button from "../../components/Button";
import styled from 'styled-components';
import { Field } from '@atlaskit/form';
import TextField from '@atlaskit/textfield';
import Space from '../../components/Space'
import { Icon } from 'react-icons-kit';
import { google } from 'react-icons-kit/icomoon/google';
import AuthContext from '../../utils/context'

import AccountLayout from '../../components/Layouts/Account';


const Container = styled.div`
  color: #231c47;


  .content {
    border-radius: 8px;

    background-color: #fff;
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
      0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
    overflow: hidden;
    margin-top: 32px;
  }

  .left {
    background-color: #231c48;
    height: inherit;
    color: #fff;
    text-align: center;
    font-size: 1.5rem;
    display: flex;
    justify-content: center;
    align-items: center;

    font-weight: 300;
    padding: 64px 32px;
  }

  .right {
    background-color: #fff;
    padding: 64px 48px;
  }

  label,
  span {
    color: #231c47;
  }

  a {
    color: #5ccada;
    text-decoration: underline;
  }

  .leftIcon {
    position: absolute;
    left: 16px;
  }
  input[type='email'] {
    padding: 16px !important;
    border-radius: 4px;
  }

  .text span {
    color: #fff;
  }
`;



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
    <AccountLayout>
      <Container className="container">
        <div className="row content" >

          <div className="col right">
            <div>
              <h1>Login to Diff</h1>
              <Space top={4}>
                <p>with Google</p>
                <GoogleButton onClick={onLoginWithGoogle}>
                  <span>
                    <Icon icon={google} className="leftIcon" />
                    Continue with Google
                  </span>
                </GoogleButton>
              </Space>
            </div>
            <div style={{ margin: '32px 0px' }}>
              <DarkHR />
            </div>
            <div>
              <form onSubmit={onLoginWithMagicLink}>
                <Field name="username" defaultValue="" label="User name" isRequired>
                  {({ fieldProps }) => <TextField {...fieldProps} />}
                </Field>

                <MagicLinkButton type="submit" primary>
                  <span>Send Magic Link</span>
                </MagicLinkButton>
              </form>
            </div>
          </div>
        </div>
      </Container>
    </AccountLayout>
  )
}


export default Login;