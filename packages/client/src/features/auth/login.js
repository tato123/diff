import React, { useContext } from "react";
import styled from "styled-components";

import AuthContext from "../../utils/context";
import LoginForm from "./forms/login";
import GoogleButton from "react-google-button";

import { Layout, Divider } from "antd";

import { Router } from "react-router-dom";

// import * as yup from "yup";

// const MagicLinkButton = styled(Button)`
//   margin-top: 16px;
//   background-color: #43cad9 !important;
//   width: 100%;
// `;

const FormWrapper = styled.div`
  max-width: 600px;
  padding: 32px;
`;

// const schema = yup.object().shape({
//   email: yup.string().email(),
//   password: yup.string().min(8)
// });

// const validateEmail = value => {
//   const result = schema.isValidSync({ email: value });
//   if (result) {
//     return;
//   }
//   return "INVALID_EMAIL";
// };

// const validatePassword = value => {
//   const result = schema.isValidSync({ password: value });
//   if (result) {
//     return;
//   }
//   return "Password length must be 8 characters";
// };

// const SignupForm = ({ onSubmit }) => {
//   return (
//     <Form onSubmit={onSubmit}>
//       {({ formProps, submitting }) => (
//         <form {...formProps} autoComplete="off">
//           <Field
//             name="email"
//             defaultValue=""
//             label="Email"
//             isRequired
//             validate={validateEmail}
//           >
//             {({ fieldProps, error }) => (
//               <>
//                 <TextField {...fieldProps} />
//                 {error === "INVALID_EMAIL" && (
//                   <ErrorMessage>A valid email address is required</ErrorMessage>
//                 )}
//               </>
//             )}
//           </Field>
//           <Field
//             name="password"
//             defaultValue=""
//             label="Password"
//             isRequired
//             validate={validatePassword}
//           >
//             {({ fieldProps, error }) => (
//               <>
//                 <TextField {...fieldProps} type="password" />
//                 {error && (
//                   <ErrorMessage>
//                     <pre>
//                       <code>{error}</code>
//                     </pre>
//                   </ErrorMessage>
//                 )}
//               </>
//             )}
//           </Field>
//           <MagicLinkButton type="submit" primary>
//             <span>Create Account</span>
//           </MagicLinkButton>
//         </form>
//       )}
//     </Form>
//   );
// };

// const SigninForm = ({ onSubmit }) => {
//   return (
//     <Form onSubmit={onSubmit}>
//       {({ formProps, submitting, error }) => (
//         <form {...formProps} autoComplete="off">
//           <Field
//             name="email"
//             defaultValue=""
//             label="Email"
//             isRequired
//             validate={validateEmail}
//           >
//             {({ fieldProps, error }) => (
//               <>
//                 <TextField {...fieldProps} />
//                 {error === "INVALID_EMAIL" && (
//                   <ErrorMessage>A valid email address is required</ErrorMessage>
//                 )}
//               </>
//             )}
//           </Field>
//           <Field
//             name="password"
//             defaultValue=""
//             label="Password"
//             isRequired
//             validate={validatePassword}
//           >
//             {({ fieldProps, error }) => (
//               <>
//                 <TextField {...fieldProps} type="password" />
//                 {error && (
//                   <ErrorMessage>
//                     <pre>
//                       <code>{error}</code>
//                     </pre>
//                   </ErrorMessage>
//                 )}
//               </>
//             )}
//           </Field>
//           <MagicLinkButton type="submit" primary>
//             <span>Sign in</span>
//           </MagicLinkButton>
//         </form>
//       )}
//     </Form>
//   );
// };

/* eslint-disable jsx-a11y/anchor-is-valid */

const Login = ({ history }) => {
  const auth = useContext(AuthContext);
  // const [signup, setSignup] = useState(false);

  if (auth.isAuthenticated()) {
    auth.handleRedirect();
  }

  // const onLoginWithMagicLink = async (data) => {

  //   try {
  //     const res = await auth.passwordlessLogin(data.email);
  //     console.log(res)
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };
  // const onUsernamePasswordSignup = async data => {
  //   try {
  //     const res = await auth.signup(data.email, data.password);
  //     console.log(res);
  //   } catch (error) {
  //     console.error(error);
  //     return { password: error.policy };
  //   }
  // };

  // const onUsernamePasswordSignin = async data => {
  //   try {
  //     auth.loginWithEmail(data.email, data.password);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  return (
    <Router history={history}>
      <Layout style={{ height: "100vh" }}>
        <Layout.Content
          style={{
            justifyContent: "center",
            display: "flex",
            alignItems: "center"
          }}
        >
          <FormWrapper>
            <LoginForm />

            <Divider orientation="left" style={{ fontSize: 14 }}>
              Or login with...
            </Divider>
            <GoogleButton
              style={{ width: "100%", fontSize: 14 }}
              type="light" // can also be written as disabled={true} for clarity
              onClick={auth.loginWithGoogle}
            />
          </FormWrapper>
        </Layout.Content>
      </Layout>
    </Router>
  );
};

export default Login;
