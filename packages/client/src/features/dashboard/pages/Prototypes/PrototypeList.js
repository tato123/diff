import React from 'react';
import { useQuery } from 'react-apollo-hooks';
import { Card, Typography } from 'antd';
import gql from 'graphql-tag';
import Icon from 'react-icons-kit';
import { images } from 'react-icons-kit/icomoon/images'
import styled from 'styled-components';
import _ from 'lodash';

const { Meta } = Card;
const {Title} = Typography;



const GET_ORIGINS = gql`
  {
    origins(limit:{mine:true}) {
      host
      origin
    }
  }
`;

const Block = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  height: 100%;
  flex-direction: row;
`

const CardStyles = {
    width: 240,
    background: "#fff",
    marginRight: 8,
    marginBottom: 8
}

const CardCover = styled.div`
background: #efefef;
    height: 100px;
    display: flex !important;
    justify-content: center;
    color:#c9c9c9;
    align-items: center;
`


const Prototypes = ({ history, filter }) => {
    const { data, error, loading } = useQuery(GET_ORIGINS);
    const goTo = (url) => () => {
        history.replace(url);
    }

    if (loading) {
        return <Block layout>
            <Card style={CardStyles} loading />
            <Card style={CardStyles} loading />

        </Block>;
    };
    if (error) {
        return <div>Error! {error.message}</div>;
    };

    const groups = _.chain(data.origins)
        .filter(x => _.isEmpty(filter) ? true : x.origin.indexOf(filter) !== -1)
        .reduce((acc, x) => {
            const { origin: host } = x;
            if (!acc[host]) {
                return {
                    ...acc,
                    [host]: [x]
                }
            }

            return {
                ...acc,
                [host]: [...acc[host], x]
            }
        }, {})
        .value();


    return (
        <div>
            {data.origins.length === 0 && (
                <label>empty</label>
            )}
            {_.keys(groups).map(key => {
                return (
                    <div style={{marginBottom: 32}}>
                        <Title level={4}>{key}</Title>
                        <Block layout>
                        {groups[key].map(origin => (
                            <Card
                                hoverable
                                style={CardStyles}
                                key={origin.host}
                                cover={<CardCover><Icon size={32} icon={images} /></CardCover>}

                            >
                                <Meta
                                    title={origin.host}
                                    description={origin.origin}
                                />
                            </Card>

                        ))}
                        </Block>

                    </div>
                )
            })}
        </div>
      
    );
}





export default Prototypes;