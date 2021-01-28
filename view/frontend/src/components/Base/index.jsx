import React from 'react';
import { Layout } from 'antd';
import "./Base.scss"
import cn from "classnames";
const {Header, Footer, Content} = Layout;

const Index = ({className, children}) => {
    return (
        <Layout>
            <Header className="header">
                <div className="header-logo">Site Watcher</div>
            </Header>
            <Content className={cn("content", className)}>
                {children}
            </Content>
        </Layout>
    )
};

export default Index;


