import React from "react";
import styled from "styled-components";
import EmptyState from "@atlaskit/empty-state";

const View = styled.div`
  display: flex;
  padding: 16px;
  box-sizing: border-box;
`;

const props = {
  header: "I am the header",
  description: `Lorem ipsum is a pseudo-Latin text used in web design, 
        typography, layout, and printing in place of English to emphasise 
        design elements over content. It's also called placeholder (or filler) 
        text. It's a convenient tool for mock-ups.`
};

export default ({ open }) => (
  <View>
    <EmptyState {...props} />
  </View>
);
