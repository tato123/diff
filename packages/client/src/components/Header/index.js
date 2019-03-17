import React, { useContext, useState, useEffect } from 'react';
import Logo from "../Logo";
import styled from 'styled-components';
import AuthContext from '../../utils/context'
import Avatar from '../Avatar'


const Container = styled.header`
    display: inline-block;
    width: 100%;
    margin-top: 16px;
`

const Nav = styled.nav`
    display: grid;
    grid-template-areas: "logo menu account";
    grid-template-columns: 1fr 3fr 1fr;
`

const Brand = styled.div`
    grid-area: logo;
`

const Menu = styled.div`
    grid-area: menu;
`
const Account = styled.div`
    grid-area: account;
    display: flex;
    flex: 1 auto;
    align-items:center;
`



const Header = () => {

    const auth = useContext(AuthContext);
    const user = auth.getProfile();
    const logout = () => auth.logout();

    return (
        <Container>
            <Nav>
                <Brand>
                    <Logo size="200px" />
                </Brand>
                <Menu>
                    test
                </Menu>
                <Account>
                    {auth.isAuthenticated() && (
                        <React.Fragment>
                            <Avatar src={user.picture} />
                            <a onClick={logout}>logout</a>
                        </React.Fragment>
                    )}

                </Account>
            </Nav>
        </Container>
    )

}
export default Header;