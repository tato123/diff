import React from "react";
import PropTypes from "prop-types";
import Textfield from "@atlaskit/textfield";
import Button from "@atlaskit/button";
import styled from "styled-components";
import { CREATE_SITE } from "../../graphql/mutations";
import Logo from "../../components/Logo";
import { withFormik } from "formik";
import * as Yup from "yup";
import { compose, graphql } from "react-apollo";

const Page = styled.div`
  margin: 0 15%;
  margin-top: 16px;

  img {
    object-fit: none;
  }
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1 auto;
  width: 100%;
  align-items: center;
  margin-top: 16px;

  button {
    height: 40px;
  }

  > div {
    margin-right: 16px;
  }
`;

const SiteSchema = Yup.object().shape({
  website: Yup.string()
    .test("is-url", "Is not a url", value => {
      const re = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
      return re.test(value);
    })
    .required()
});

const Designer = ({
  handleBlur,
  handleChange,
  values,
  handleSubmit,
  errors,
  isSubmitting
}) => (
  <Page>
    <Logo />
    <form onSubmit={handleSubmit} autoComplete="off">
      <Row>
        <Textfield
          name="website"
          autoFocus
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.website}
          type="text"
          placeholder="Prototype a website by typing a URL"
        />
        <Button
          appearance="primary"
          isDisabled={errors.website}
          isLoading={isSubmitting}
          style={{ height: "40px" }}
        >
          Create Prototype
        </Button>
      </Row>
      <Row>
        <div style={{ textAlign: "center", width: "100%" }}>
          Create a new prototype by entering a URL in the text bar. Diff lets
          you edit your website just like Chrome devtools, except you can share
          your changes with anyone using a prototype URL.
        </div>
      </Row>
    </form>
  </Page>
);

const submitValue = (payload, { props, setSubmitting, setErrors }) => {
  const { website } = payload;

  props
    .createSite({ variables: { input: { url: website } } })
    .then(response => {
      setSubmitting(false);
      console.log(response.data);
      props.history.push("/edit");
    })
    .catch(e => {
      const errors = e.graphQLErrors.map(error => error.message);
      console.log(errors);
      setSubmitting(false);
      setErrors({ form: errors });
      console.log(e);
    });
};

export default compose(
  graphql(CREATE_SITE, { name: "createSite" }),
  withFormik({
    validationSchema: SiteSchema,
    initialValues: { website: "" },
    mapPropsToValues: ({ variables }) => ({
      website: ""
    }),
    handleSubmit: submitValue,
    displayName: "Landing"
  })
)(Designer);
