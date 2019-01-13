import React from "react";
import styled from "styled-components";
import ShareButton from "../../components/ShareButton";
import Modal from "styled-react-modal";

const StyledModal = Modal.styled`
  width: 700px;
  height: 75px;
  display: flex;
  flex-direction: column;
  border-radius: 20px;
  padding: 20px;
  background-color: #fff;


  .form-group {
    display: flex;
    flex-direction: column;
    border-bottom: 1px solid #ccc;
    padding-bottom: 16px;

    .title {
      display: block;
    font-size: 11px;
    margin-bottom: 8px
    text-transform: uppercase;
    font-weight: 500;
    }

    .data {
      font-size: 22px;
      font-weight: 300;
    }
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1 auto;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  padding: 8px 32px;
  border-right: 1px solid #ccc;

  label {
    display: block;
    font-size: 11px;
    margin-bottom: 6px
    text-transform: uppercase;
    font-weight: 500;
  }
  
  div {
    font-size: 22px;
    font-weight: 300;
  }

  input[type="text"] {
      border: none;
      outline: none;
      width: 100%;

  }
`;

const FlexContainer = styled.div`
  display: flex;
  flex: 1 auto;
  justify-content: flex-end;
  align-content: center;
  margin-right: 16px;
`;

export default class Header extends React.Component {
  state = {
    isOpen: false
  };

  toggleModal = e => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  render() {
    return (
      <Container>
        <Field>
          <label>Project:</label>
          <div>Redesign AtlanticBT</div>
        </Field>
        <Field style={{ border: "none", flex: "1 auto" }}>
          <label>Preivew At(URL):</label>
          <div>
            <input
              type="text"
              placeholder="http://www.domain.com"
              value="https://lipsum.com/"
            />
          </div>
        </Field>
        <FlexContainer>
          <ShareButton onClick={this.toggleModal} />
        </FlexContainer>
        <StyledModal
          isOpen={this.state.isOpen}
          onBackgroundClick={this.toggleModal}
          onEscapeKeydown={this.toggleModal}
        >
          <div>
            <div class="form-group">
              <label class="title">Shareable URL:</label>
              <label class="data">
                https://p-f9jpegyzu-dot-tester-dot-experiments-224320.appspot.com/
              </label>
            </div>
          </div>
        </StyledModal>
      </Container>
    );
  }
}
