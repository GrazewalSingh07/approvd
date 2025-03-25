import { useEffect, useState } from "react";
import {
  Tabs,
  Card,
  Typography,
  Avatar,
  Button,
  Form,
  Input,
  Divider,
  List,
  Badge,
  message,
  Tag,
  Spin,
  Empty,
} from "antd";
import {
  UserOutlined,
  ShoppingOutlined,
  HeartOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  EditOutlined,
  SaveOutlined,
  LockOutlined,
  LoadingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useAuth } from "../contexts/authContext";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { doSignOut } from "../firebase/auth";
import { useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserOrders } from "../services/orders.service";
import { getUserData } from "../services/user.service";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

export const Profile = () => {
  const { userLoggedIn, currentUser } = useAuth();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const queryClient = useQueryClient();

  const {
    data: userData,
    isLoading: userLoading,
    isSuccess: userSuccess,
    error: userError,
  } = useQuery({
    queryKey: ["user", currentUser?.uid],
    queryFn: () => getUserData(currentUser?.uid),
    enabled: !!userLoggedIn && !!currentUser?.uid,
  });

  useEffect(() => {
    if (userSuccess) {
      profileForm.setFieldsValue({
        displayName: userData.displayName || "",
        email: userData.email || user?.email || "",
        phone: userData.phone || "",
        address: userData.address || "",
        city: userData.city || "",
        state: userData.state || "",
        pincode: userData.pincode || "",
      });
    }
  }, [userSuccess]);

  // Fetch orders with React Query
  const {
    data: orders,
    isLoading: ordersLoading,
    error: ordersError,
  } = useQuery({
    queryKey: ["orders", currentUser?.uid],
    queryFn: () => getUserOrders(currentUser?.uid),
    enabled: !!userLoggedIn && !!currentUser?.uid,
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (formData) => {
      if (!userLoggedIn || !user) {
        throw new Error("User not authenticated");
      }

      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        displayName: formData.displayName,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        updatedAt: new Date(),
      });

      return formData;
    },
    onSuccess: () => {
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: ["user", user?.uid] });
      message.success("Profile updated successfully");
      setEditMode(false);
    },
    onError: (error) => {
      console.error("Error updating profile:", error);
      message.error("Failed to update profile");
    },
  });

  // Handle profile update
  const handleUpdateProfile = (values) => {
    updateProfileMutation.mutate(values);
  };

  // Change password handler
  const handleChangePassword = async (values) => {
    // This would normally handle password change via Firebase Auth
    message.info("Password change functionality would be implemented here");
    passwordForm.resetFields();
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await doSignOut();
      message.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      message.error("Failed to log out");
    }
  };

  if (!userLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Title level={3}>Please log in to view your profile</Title>
        <Button
          type="primary"
          size="large"
          onClick={() => navigate("/login")}
          className="mt-4"
        >
          Go to Login
        </Button>
      </div>
    );
  }

  if (userError) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 text-center">
        <Title level={3} className="text-red-500">
          Error loading profile
        </Title>
        <Text>{userError.message}</Text>
        <Button
          type="primary"
          onClick={() =>
            queryClient.invalidateQueries({ queryKey: ["user", user?.uid] })
          }
          className="mt-4"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Title level={2}>My Account</Title>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Profile sidebar */}
        <div className="md:col-span-1">
          <Card className="text-center sticky top-4">
            <div className="mb-4">
              {userLoading ? (
                <Spin
                  indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
                />
              ) : (
                <Avatar
                  size={80}
                  icon={<UserOutlined />}
                  src={userData?.photoURL}
                />
              )}
            </div>

            <Title level={4} className="mb-1">
              {userLoading ? (
                <Spin size="small" />
              ) : (
                userData?.displayName || "User"
              )}
            </Title>

            <Text type="secondary" className="block mb-4">
              {/* {userData?.email || user?.email} */}
            </Text>

            <Divider />

            <div className="space-y-4">
              <Button
                type="primary"
                color="default"
                variant="solid"
                icon={<LogoutOutlined />}
                onClick={handleLogout}
                block
              >
                Logout
              </Button>
            </div>
          </Card>
        </div>

        {/* Main content area */}
        <div className="md:col-span-3">
          <Card>
            <Tabs defaultActiveKey="1">
              <TabPane
                tab={
                  <span>
                    <UserOutlined /> Profile
                  </span>
                }
                key="1"
              >
                <div className="relative">
                  {userLoading && (
                    <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-10">
                      <Spin
                        indicator={
                          <LoadingOutlined style={{ fontSize: 24 }} spin />
                        }
                      />
                    </div>
                  )}

                  <div className="flex justify-between mb-4">
                    <Title level={4}>Personal Information</Title>
                    <Button
                      color="default"
                      variant={editMode ? "solid" : "outlined"}
                      type={editMode ? "primary" : "default"}
                      icon={editMode ? <SaveOutlined /> : <EditOutlined />}
                      onClick={() => {
                        if (editMode) {
                          profileForm.submit();
                        } else {
                          setEditMode(true);
                        }
                      }}
                      loading={updateProfileMutation.isPending}
                    >
                      {editMode ? "Save Changes" : "Edit Profile"}
                    </Button>
                  </div>

                  {updateProfileMutation.isSuccess && (
                    <div className="mb-4">
                      <Tag color="success" className="py-1 px-2">
                        Profile updated successfully!
                      </Tag>
                    </div>
                  )}

                  <Form
                    form={profileForm}
                    layout="vertical"
                    onFinish={handleUpdateProfile}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Form.Item
                        name="displayName"
                        label="Full Name"
                        rules={[
                          { required: true, message: "Please enter your name" },
                        ]}
                      >
                        <Input
                          prefix={<UserOutlined className="text-gray-400" />}
                          disabled={
                            !editMode || updateProfileMutation.isPending
                          }
                        />
                      </Form.Item>

                      <Form.Item name="email" label="Email">
                        <Input
                          prefix={<MailOutlined className="text-gray-400" />}
                          disabled={true}
                        />
                      </Form.Item>

                      <Form.Item name="phone" label="Phone Number">
                        <Input
                          prefix={<PhoneOutlined className="text-gray-400" />}
                          disabled={
                            !editMode || updateProfileMutation.isPending
                          }
                        />
                      </Form.Item>
                    </div>

                    <Divider>Address Information</Divider>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Form.Item
                        name="address"
                        label="Address"
                        className="md:col-span-2"
                      >
                        <Input
                          prefix={<HomeOutlined className="text-gray-400" />}
                          disabled={
                            !editMode || updateProfileMutation.isPending
                          }
                        />
                      </Form.Item>

                      <Form.Item name="city" label="City">
                        <Input
                          disabled={
                            !editMode || updateProfileMutation.isPending
                          }
                        />
                      </Form.Item>

                      <Form.Item name="state" label="State">
                        <Input
                          disabled={
                            !editMode || updateProfileMutation.isPending
                          }
                        />
                      </Form.Item>

                      <Form.Item name="pincode" label="Pincode">
                        <Input
                          disabled={
                            !editMode || updateProfileMutation.isPending
                          }
                        />
                      </Form.Item>
                    </div>
                  </Form>

                  <Divider>Security</Divider>

                  <Form
                    form={passwordForm}
                    layout="vertical"
                    onFinish={handleChangePassword}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Form.Item
                        name="currentPassword"
                        label="Current Password"
                        rules={[
                          {
                            required: true,
                            message: "Please enter your current password",
                          },
                        ]}
                      >
                        <Input.Password
                          prefix={<LockOutlined className="text-gray-400" />}
                          disabled={!editMode}
                        />
                      </Form.Item>

                      <div></div>

                      <Form.Item
                        name="newPassword"
                        label="New Password"
                        rules={[
                          {
                            required: true,
                            message: "Please enter a new password",
                          },
                        ]}
                      >
                        <Input.Password disabled={!editMode} />
                      </Form.Item>

                      <Form.Item
                        name="confirmPassword"
                        label="Confirm New Password"
                        rules={[
                          {
                            required: true,
                            message: "Please confirm your new password",
                          },
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              if (
                                !value ||
                                getFieldValue("newPassword") === value
                              ) {
                                return Promise.resolve();
                              }
                              return Promise.reject(
                                new Error("Passwords do not match"),
                              );
                            },
                          }),
                        ]}
                      >
                        <Input.Password disabled={!editMode} />
                      </Form.Item>
                    </div>

                    {editMode && (
                      <Button type="primary" htmlType="submit" className="mt-4">
                        Change Password
                      </Button>
                    )}
                  </Form>
                </div>
              </TabPane>

              <TabPane
                tab={
                  <span>
                    <ShoppingOutlined /> Order History
                  </span>
                }
                key="2"
              >
                <Title level={4}>My Orders</Title>

                {ordersLoading ? (
                  <div className="flex justify-center py-8">
                    <Spin
                      indicator={
                        <LoadingOutlined style={{ fontSize: 24 }} spin />
                      }
                    />
                  </div>
                ) : ordersError ? (
                  <div className="text-center py-8">
                    <Text type="danger">
                      Error loading orders: {ordersError.message}
                    </Text>
                    <div className="mt-4">
                      <Button
                        onClick={() =>
                          queryClient.invalidateQueries({
                            queryKey: ["orders", user?.uid],
                          })
                        }
                      >
                        Retry
                      </Button>
                    </div>
                  </div>
                ) : !orders || orders.length === 0 ? (
                  <Empty
                    description="You haven't placed any orders yet"
                    className="py-8"
                  >
                    <Button
                      type="primary"
                      color="default"
                      variant="solid"
                      onClick={() => navigate("/")}
                    >
                      Start Shopping
                    </Button>
                  </Empty>
                ) : (
                  <List
                    itemLayout="horizontal"
                    dataSource={orders}
                    renderItem={(order) => (
                      <List.Item
                        className="border rounded-lg p-4 mb-4 hover:shadow-md transition-shadow"
                        key={order.id}
                      >
                        <div className="w-full px-4">
                          <div className="flex justify-between items-center mb-2">
                            <div>
                              <Text strong>Order #{order.id.slice(0, 8)}</Text>
                              <Text className="ml-4 text-gray-500">
                                {new Date(
                                  order.createdAt?.seconds * 1000,
                                ).toLocaleDateString()}
                              </Text>
                            </div>
                            <Badge
                              status={
                                order.status === "delivered"
                                  ? "success"
                                  : order.status === "shipped"
                                    ? "processing"
                                    : order.status === "processing"
                                      ? "warning"
                                      : "default"
                              }
                              text={
                                <span className="capitalize">
                                  {order.status}
                                </span>
                              }
                            />
                          </div>

                          <div className="flex flex-wrap gap-4 mb-2">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex items-center">
                                <Avatar
                                  shape="square"
                                  size={40}
                                  src={item.image}
                                  className="mr-2"
                                />
                                <div>
                                  <Text className="block">{item.name}</Text>
                                  <Text type="secondary">
                                    Qty: {item.quantity}
                                  </Text>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="flex justify-between items-center mt-3 pt-3 border-t">
                            <Button
                              size="small"
                              onClick={() => navigate(`/orders/${order.id}`)}
                            >
                              View Details
                            </Button>
                            <Text strong>Total: ₹{order.totalPrice}</Text>
                          </div>
                        </div>
                      </List.Item>
                    )}
                  />
                )}
              </TabPane>

              {/* <TabPane
                tab={
                  <span>
                    <HeartOutlined /> Wishlist
                  </span>
                }
                key="3"
              >
                <Title level={4}>My Wishlist</Title>
                <Empty description="No items in your wishlist yet">
                  <Button
                    type="primary"
                    color="default"
                    variant="solid"
                    onClick={() => navigate("/products")}
                  >
                    Explore Products
                  </Button>
                </Empty>
              </TabPane> */}
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
};
