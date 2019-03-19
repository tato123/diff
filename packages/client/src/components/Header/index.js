import React, { useContext, useState, useEffect } from 'react';
import Logo from "../Logo";
import styled from 'styled-components';
import AuthContext from '../../utils/context'
import Avatar from '../Avatar'
import { Link } from 'react-router-dom'


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
    justify-content: flex-end;
`



const Header = () => {

    const auth = useContext(AuthContext);
    const user = auth.getProfile();


    return (
        <Container>
            <Nav>
                <Brand>
                    <Link to="/">
                        <Logo size="200px" />
                    </Link>
                </Brand>
                <Menu>
                </Menu>
                <Account>
                    {auth.isAuthenticated() && (
                        <React.Fragment>
                            <Link to="/account">
                                <Avatar src={user.picture} />
                            </Link>
                            <a href="" onClick={auth.logout}>logout</a>
                        </React.Fragment>
                    )}
                    {!auth.isAuthenticated() && (
                        <Link to="/login">Login</Link>
                    )}

                </Account>
            </Nav>
        </Container>
    )

}
export default Header;