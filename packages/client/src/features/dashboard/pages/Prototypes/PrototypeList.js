import React, { useContext, useState, useEffect } from "react";
import { useQuery, useSubscription } from "react-apollo-hooks";
import { Card, Typography, Empty } from "antd";
import gql from "graphql-tag";
import Icon from "react-icons-kit";
import { images } from "react-icons-kit/icomoon/images";
import styled from "styled-components";
import _ from "lodash";
import UserContext from "../../../../utils/context";

const { Meta } = Card;
const { Title } = Typography;

const GET_PROJECTS = gql`
  query getProjects($uid: String!) {
    projects(uid: $uid) {
      protocol
      hostname
      name
      description
    }
  }
`;

const ON_ADD_PROJECT = gql`
  subscription onAddProjectSub($uid: String!) {
    onAddProject(uid: $uid) {
      protocol
      hostname
      name
      description
    }
  }
`;

const ON_DELETE_PROJECT = gql`
  subscription onDeleteProjectSub($uid: String!) {
    onDeleteProject(uid: $uid) {
      protocol
      hostname
      name
      description
    }
  }
`;

const Block = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  height: 100%;
  flex-direction: row;
`;

const CardStyles = {
  width: 240,
  background: "#fff",
  marginRight: 8,
  marginBottom: 8
};

const CardCover = styled.div`
  background: #efefef;
  height: 100px;
  display: flex !important;
  justify-content: center;
  color: #c9c9c9;
  align-items: center;
`;

const Prototypes = ({ history, filter, onClick }) => {
  const user = useContext(UserContext);
  const [projects, setProjects] = useState([]);
  const gqlArgs = {
    variables: {
      uid: user.getProfile().sub
    }
  };

  const { data: queryData, error, loading } = useQuery(GET_PROJECTS, gqlArgs);
  const { data: onAddProjectData } = useSubscription(ON_ADD_PROJECT, gqlArgs);
  const { data: onDeleteProjectData } = useSubscription(
    ON_DELETE_PROJECT,
    gqlArgs
  );

  useEffect(() => {
    if (queryData && queryData.projects) {
      setProjects(p => queryData.projects);
    }
  }, [queryData]);

  useEffect(() => {
    if (onAddProjectData && onAddProjectData.onAddProject) {
      debugger;
      setProjects(p => [...p, onAddProjectData.onAddProject]);
    }
  }, [onAddProjectData]);

  useEffect(() => {
    if (onDeleteProjectData && onDeleteProjectData.onDeleteProject) {
      debugger;
      setProjects(p =>
        _.remove(p, { id: onDeleteProjectData.onDeleteProject.id })
      );
    }
  }, [onDeleteProjectData]);

  if (loading) {
    return (
      <Block layout>
        <Card style={CardStyles} loading />
        <Card style={CardStyles} loading />
      </Block>
    );
  }
  if (error) {
    return <div>Error! {error.message}</div>;
  }

  const groups = _.chain(projects)
    .filter(x => (_.isEmpty(filter) ? true : x.origin.indexOf(filter) !== -1))
    .reduce((acc, x) => {
      const { origin: host } = x;
      if (!acc[host]) {
        return {
          ...acc,
          [host]: [x]
        };
      }

      return {
        ...acc,
        [host]: [...acc[host], x]
      };
    }, {})
    .value();

  return (
    <div>
      {projects.length === 0 && (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          imageStyle={{ height: 120 }}
          description={
            <label>Looks like you haven't created any prototypes yet</label>
          }
        />
      )}
      {_.keys(groups).map(key => {
        return (
          <div style={{ marginBottom: 32 }} key={key}>
            <Title level={4}>{key}</Title>
            <Block layout>
              {groups[key].map(origin => (
                <Card
                  onClick={() => onClick(origin)}
                  hoverable
                  style={CardStyles}
                  key={origin.host}
                  cover={
                    <CardCover>
                      <Icon size={32} icon={images} />
                    </CardCover>
                  }
                >
                  <Meta title={origin.name} />
                </Card>
              ))}
            </Block>
          </div>
        );
      })}
    </div>
  );
};

export default Prototypes;
