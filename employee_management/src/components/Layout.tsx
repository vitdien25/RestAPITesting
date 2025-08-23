import React from "react";
import { Layout, ConfigProvider } from "antd";
import { Outlet } from "react-router-dom";

const { Content } = Layout;

const AppLayout: React.FC = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#1890ff",
        },
      }}
    >
      <Layout style={{ minHeight: "100vh" }}>
        <Content style={{ padding: "24px", backgroundColor: "#f5f5f5" }}>
          <div style={{ maxWidth: "1600px", margin: "0 auto" }}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </ConfigProvider>
  );
};

export default AppLayout;
