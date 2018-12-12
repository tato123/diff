import React from "react";
import styled from "styled-components";
import Dropzone from "react-dropzone";
import Messanger from "./Messanger";
import { CheckBox } from "grommet";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 auto;
`;

const Row = styled.div`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding-left: 16px;
  padding-right: 16px;
  border-bottom: 1px solid #ccc;
`;

const HeaderRow = styled(Row)`
  border-bottom: 1px solid #ccc;
  text-transform: uppercase;
  font-size: 12px;
  padding: 8px 16px;
`;

const ContentRow = styled(Row)`
  border-bottom: 1px solid #ccc;
  min-height: 64px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const StyledDropArea = styled.div``;

const pDelta = {
  html: `<p data-df="p.01" style="font-size:1rem;line-height:1.8;">{{value}}</p>`,
  css: "p",
  id: "p.01"
};

const h2Delta = {
  html: `<h2 data-df="p.02" style="font-size:2rem;font-family:Arial;font-weight:bold;line-height:1.5;">{{value}}</h2>`,
  css: "h2",
  id: "p.02"
};

const h1Delta = {
  html: `<h1 data-df="p.03" style="font-size:5rem;font-family:Arial;font-weight:100;line-height:1.5;">{{value}}</h1>`,
  css: "h1",
  id: "p.03"
};

const List = () => (
  <Messanger>
    {sendMessage => (
      <Container>
        <HeaderRow>Previewing changes for:</HeaderRow>
        <ContentRow>
          <CheckBox
            toggle
            onChange={evt =>
              sendMessage({
                type: !!evt.target.checked ? "apply" : "remove",
                ...pDelta
              })
            }
          />
          <label>Paragraphs</label>
        </ContentRow>
        <ContentRow>
          <CheckBox
            toggle
            onChange={evt =>
              sendMessage({
                type: !!evt.target.checked ? "apply" : "remove",
                ...h1Delta
              })
            }
          />
          <label>H1</label>
        </ContentRow>
        <ContentRow>
          <CheckBox
            toggle
            onChange={evt =>
              sendMessage({
                type: !!evt.target.checked ? "apply" : "remove",
                ...h2Delta
              })
            }
          />
          <label>H2</label>
        </ContentRow>
      </Container>
    )}
  </Messanger>
);

export default List;

// <form
// onSubmit={evt => {
//   evt.preventDefault();
//   sendMessage({
//     css: evt.target.css.value,
//     html: evt.target.text.value
//   });
//   return false;
// }}
// >
// <textarea name="text" />
// <input name="css" type="text" placeholder=".css" />
// <button type="submit">button</button>
// </form>
