import React from "react";
import { Layout, Row, Col, Typography, Space } from "antd";
import {
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  LinkedinOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";

const { Footer } = Layout;
const { Text, Title } = Typography;

export const CustomFooter = () => {
  return (<>
    <Footer style={{ color: "#fff", padding: "40px", backgroundColor: "#000" }}>
      <Row justify="space-around" align="middle">
        {/* Contact Info */}
        <Col xs={24} sm={12} md={6}>
          <Title level={4} style={{ color: "#fff" }}>
            Contact Us
          </Title>
          <Space direction="vertical">
            <Text style={{ color: "#fff" }}>
              <PhoneOutlined /> +123 456 7890
            </Text>
            <Text style={{ color: "#fff" }}>
              <MailOutlined /> info@example.com
            </Text>
          </Space>
        </Col>

        {/* Logo */}
        <Col xs={24} sm={12} md={6} style={{ textAlign: "center" }}>
          <img
            src="/logo.jpeg" // Replace with your logo's path
            alt="Logo"
            style={{ width: "100px", marginBottom: "20px" }}
          />
        </Col>

        {/* Basic Links */}
        <Col xs={24} sm={12} md={6}>
          <Title level={4} style={{ color: "#fff" }}>
            Quick Links
          </Title>
          <Space direction="vertical">
            <Text className="hover:underline underline-offset-4" style={{ color: "#fff", cursor: "pointer" }}>About Us</Text>
            <Text className="hover:underline underline-offset-4" style={{ color: "#fff", cursor: "pointer" }}>Privacy Policy</Text>
            <Text className="hover:underline underline-offset-4" style={{ color: "#fff", cursor: "pointer" }}>Terms of Service</Text>
          </Space>
        </Col>

        {/* Social Media Icons */}
        <Col xs={24} sm={12} md={6} style={{ textAlign: "center" }}>
          <Title level={4} style={{ color: "#fff" }}>
            Follow Us
          </Title>
          <Space size="large">
            <FacebookOutlined style={{ fontSize: "24px", color: "#fff", cursor: "pointer" }} />
            <TwitterOutlined style={{ fontSize: "24px", color: "#fff", cursor: "pointer" }} />
            <InstagramOutlined style={{ fontSize: "24px", color: "#fff", cursor: "pointer" }} />

          </Space>
        </Col>
      </Row>
    </Footer>
    <div style={{ backgroundColor: "#000", color: "#fff", textAlign: "center", padding: "10px 0" }}>
      <Text className="text-white">
        Proudly made in India 🇮🇳 | © {new Date().getFullYear()} Approvd
      </Text>
    </div>
  </>
  );
};


