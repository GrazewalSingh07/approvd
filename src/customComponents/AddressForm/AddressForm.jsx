import React from "react";
import { Form, Input, Button, Select, Row, Col, Typography } from "antd";

const { Title } = Typography;
const { Option } = Select;

export const AddressForm = ({
  onSubmit,
  initialValues = {},
  loading = false,
}) => {
  const [form] = Form.useForm();

  // Indian states for dropdown selection
  const indianStates = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Delhi",
    "Jammu and Kashmir",
    "Ladakh",
    "Puducherry",
    "Lakshadweep",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Andaman and Nicobar Islands",
  ];

  const handleSubmit = (values) => {
    onSubmit(values);
  };

  React.useEffect(() => {
    form.setFieldsValue(initialValues);
  }, [form, initialValues]);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <Title level={3} className="mb-6">
        Shipping Information
      </Title>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={initialValues}
        requiredMark={false}
      >
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="billing_customer_name"
              label="First Name"
              rules={[
                { required: true, message: "Please enter your first name" },
              ]}
            >
              <Input placeholder="Enter your first name" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="billing_last_name"
              label="Last Name"
              rules={[
                { required: true, message: "Please enter your last name" },
              ]}
            >
              <Input placeholder="Enter your last name" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="billing_email"
          label="Email"
          rules={[
            { required: true, message: "Please enter your email" },
            { type: "email", message: "Please enter a valid email address" },
          ]}
        >
          <Input placeholder="Enter your email address" />
        </Form.Item>

        <Form.Item
          name="billing_phone"
          label="Phone Number"
          rules={[
            { required: true, message: "Please enter your phone number" },
            {
              pattern: /^[0-9]{10}$/,
              message: "Please enter a valid 10-digit phone number",
            },
          ]}
        >
          <Input placeholder="Enter your 10-digit phone number" />
        </Form.Item>

        <Form.Item
          name="billing_address"
          label="Address Line 1"
          rules={[{ required: true, message: "Please enter your address" }]}
        >
          <Input placeholder="Enter your street address" />
        </Form.Item>

        <Form.Item name="billing_address_2" label="Address Line 2">
          <Input placeholder="Apartment, suite, unit, building, floor, etc." />
        </Form.Item>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="billing_city"
              label="City"
              rules={[{ required: true, message: "Please enter your city" }]}
            >
              <Input placeholder="Enter your city" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="billing_pincode"
              label="PIN Code"
              rules={[
                { required: true, message: "Please enter your PIN code" },
                {
                  pattern: /^[0-9]{6}$/,
                  message: "Please enter a valid 6-digit PIN code",
                },
              ]}
            >
              <Input placeholder="Enter your 6-digit PIN code" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="billing_state"
              label="State"
              rules={[{ required: true, message: "Please select your state" }]}
            >
              <Select placeholder="Select your state">
                {indianStates.map((state) => (
                  <Option key={state} value={state}>
                    {state}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="billing_country"
              label="Country"
              rules={[{ required: true, message: "Please enter your country" }]}
              initialValue="India"
            >
              <Input disabled />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item className="mt-6">
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            color="default"
            variant="solid"
            loading={loading}
            block
            className="bg-blue-600 hover:bg-blue-700"
          >
            Save & Continue
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
