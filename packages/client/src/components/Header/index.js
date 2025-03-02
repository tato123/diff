import React, { useContext } from 'react';
import Logo from "../Logo";
import styled from 'styled-components';
import AuthContext from '../../utils/context'
import Avatar from '../Avatar'
import { Link, NavLink } from 'react-router-dom';
import _ from 'lodash';


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

const LinkStyle = `
margin-left: 16px;
    border: none;
    outline: none;
    background: none;
    text-transform: capitalize;
    font-weight: bold;
    cursor: pointer;

    &:hover {
        color:#4648b0;
    }
`

const LogoutLink = styled.button`
${LinkStyle}
`

const LoginLink = styled(NavLink)`
${LinkStyle}
`;



const Header = ({ account }) => {

    const auth = useContext(AuthContext);
    const user = auth.getProfile();
    const picture = _.get(user, 'picture', null);


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
                    {account && account(auth)}

                    {!account && auth.isAuthenticated() && (
                        <React.Fragment>
                            <Link to="/account">
                                <Avatar src={picture} />
                            </Link>
                            <LogoutLink onClick={auth.logout}>logout</LogoutLink>
                        </React.Fragment>
                    )}
                    {!account && !auth.isAuthenticated() && (
                        <LoginLink to="/account" activeStyle={{ display: "none" }}>Login</LoginLink>
                    )}

                </Account>
            </Nav>
        </Container>
    )

}



export default Header;