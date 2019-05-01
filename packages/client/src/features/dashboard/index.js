import React, { useContext } from "react";
import styled from "styled-components";
import { Layout, Avatar, Menu } from "antd";
import AuthContext from "../../utils/context";
import Logo from "./logo.svg";
import Prototypes from "./pages/Prototypes";
import Account from "./pages/Account";
import { Route, Switch, Redirect } from "react-router";
import Upgrade from "./pages/Upgrade";

const SubMenu = Menu.SubMenu;
const { Header, Content } = Layout;

const TopSection = styled.header`
  height: 164px;
  width: 100%;
  background: #001529;
  position: relative;

  .bottom-row {
    padding: 0 64px;

    label {
      position: absolute;
      font-size: 40px;
      line-height: 50px;
      color: #fff;
      font-weight: 200;
      bottom: 32px;
    }
  }
`;

const LogoRow = styled.div`
height: 16px;
float: left;
margin-right: 32px;
margin-left: 8px;
img {
    height: inherit;
}
}
`;

const Page = styled(Layout)`
  height: 100%;
  min-height: 100vh;
  .ant-menu.ant-menu-dark .ant-menu-item-selected,
  .ant-menu-submenu-popup.ant-menu-dark .ant-menu-item-selected {
    background-color: transparent !important;
    color: #ef3b7b;
  }
`;

const upgrade = {
  background: "#EF3B7B",
  padding: 8,
  color: "#fff",
  borderRadius: 4,
  fontWeight: 500,
  fontSize: 10
};

const Dashboard = ({ history, location }) => {
  const auth = useContext(AuthContext);

  const user = auth.getProfile();
  const handleMenuClick = e => {
    if (e.key === "6") {
      return auth.logout();
    }

    history.push(e.key);
  };

  return (
    <Page className="layout">
      <Header>
        <LogoRow className="logo">
          <img src={Logo} alt="logo" />
        </LogoRow>
        <Menu
          defaultSelectedKeys={[location.pathname]}
          theme="dark"
          mode="horizontal"
          style={{ lineHeight: "64px" }}
          onClick={handleMenuClick}
        >
          <Menu.Item key="/dashboard/prototypes">Prototypes</Menu.Item>
          <SubMenu
            style={{ float: "right" }}
            key="sub3"
            title={
              <React.Fragment>
                <Avatar
                  src={user.picture}
                  size="small"
                  icon="user"
                  style={{ marginRight: 8 }}
                />
                <label>{user.email}</label>
              </React.Fragment>
            }
          >
            <Menu.Item key="/dashboard/account">Account</Menu.Item>
            <Menu.Item key="6">Logout</Menu.Item>
          </SubMenu>
          <Menu.Item key="/dashboard/upgrade" style={{ float: "right" }}>
            <span style={upgrade}>UPGRADE NOW</span>
          </Menu.Item>
        </Menu>
      </Header>
      <TopSection>
        <div className="bottom-row">
          <label>My Prototypes</label>
        </div>
      </TopSection>
      <Content style={{ overflow: "auto" }}>
        <Switch>
          <Route exact path="/dashboard/account" component={Account} />
          <Route exact path="/dashboard/prototypes" component={Prototypes} />
          <Route exact path="/dashboard/upgrade" component={Upgrade} />
          <Redirect to="/dashboard/prototypes" />
        </Switch>
      </Content>
    </Page>
  );
};

export default Dashboard;
