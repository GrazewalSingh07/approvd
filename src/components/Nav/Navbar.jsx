import {
  Badge,
  Button,
  Drawer,
  Dropdown,
  Flex,
  Space,
  Tooltip,
  message,
} from "antd";
import React, { useState } from "react";
import { IoCartOutline, IoMailOutline } from "react-icons/io5";
import { MdAccountCircle } from "react-icons/md";
import { CiMenuBurger } from "react-icons/ci";
import { useNavigate } from "react-router";
import { useAuth } from "../../contexts/authContext";
import { doSignOut } from "../../firebase/auth";
import { useQuery } from "@tanstack/react-query";
import { getCartData } from "../../services/cart.service";
import toast from "react-hot-toast";

export const Navbar = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState("right");
  const { userLoggedIn } = useAuth();

  const { data: cartItems } = useQuery({
    queryKey: ["cart"],
    queryFn: getCartData,
  });

  const showDrawer = () => {
    setOpen(true);
  };
  const navigate = useNavigate();
  const onChange = (e) => {
    setPlacement(e.target.value);
  };
  const onClose = () => {
    setOpen(false);
  };
  const handleCart = () => {
    setOpen(false);
    navigate("/cart");
  };

  const handleLogin = (e) => {
    setOpen(false);
    navigate("/login");
  };
  const handleLogout = () => {
    setOpen(false);
    navigate("/profile");
  };
  return (
    <div className="bg-black py-2 px-4">
      <Flex justify="space-between">
        <Space
          onClick={() => navigate("/")}
          className="md:hidden max-md:visible"
        >
          <img className=" w-12" src="/logo-preview.png" />
        </Space>
        <Space>
          <Dropdown
            align={"center"}
            dropdownRender={() => (
              <div
                style={{
                  width: "100vw",
                  left: 0,
                  position: "relative",
                  top: 0,
                }}
              >
                <div style={{ backgroundColor: "white", padding: "10px 20px" }}>
                  <Button>hii</Button>
                </div>
              </div>
            )}
            trigger={["hover"]}
          >
            <a>
              <Space>
                <p
                  onClick={(e) => e.preventDefault()}
                  className="hover:underline text-white pr-4 underline-offset-[6px] max-sm:text-[12px] text-lg"
                >
                  Shop by category
                </p>
              </Space>
            </a>
          </Dropdown>
          <Dropdown
            align={"center"}
            dropdownRender={(menu) => (
              <div
                style={{
                  width: "100vw",
                  left: 0,
                  position: "relative",
                  top: 0,
                }}
              >
                <div style={{ backgroundColor: "white", padding: "10px 20px" }}>
                  {menu}
                </div>
              </div>
            )}
            trigger={["hover"]}
          >
            <a>
              <Space>
                <p
                  onClick={(e) => e.preventDefault()}
                  className="hover:underline  text-white max-sm:text-[12px] underline-offset-[6px]"
                >
                  Shop by collection
                </p>
              </Space>
            </a>
          </Dropdown>
        </Space>
        <Space
          onClick={() => navigate("/")}
          className="md:visible max-md:hidden  cursor-pointer"
        >
          <img className=" w-32" src="/logo-preview.png" />
        </Space>

        <div className="hidden md:flex">
          <Flex gap={6} align="center">
            <Tooltip placement="bottom" title="Contact us">
              <span className="cursor-pointer">
                <IoMailOutline color="white" size={26} />
              </span>
            </Tooltip>

            {userLoggedIn && (
              <Tooltip placement="bottom" title="My cart">
                <Badge count={cartItems?.items?.length} offset={[-5, 5]}>
                  <span
                    className="cursor-pointer"
                    onClick={() => navigate("/cart")}
                  >
                    <IoCartOutline color="white" size={26} />
                  </span>
                </Badge>
              </Tooltip>
            )}

            {!userLoggedIn ? (
              <Tooltip placement="bottom" title="Login/Register">
                <span
                  className="cursor-pointer"
                  onClick={() => navigate("/login")}
                >
                  <MdAccountCircle color="white" size={26} />
                </span>
              </Tooltip>
            ) : (
              <Tooltip placement="bottom" title="Profile">
                <span className="cursor-pointer" onClick={handleLogout}>
                  <MdAccountCircle color="white" size={26} />
                </span>
              </Tooltip>
            )}
          </Flex>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button
            type="text"
            onClick={showDrawer}
            className="p-0 flex items-center justify-center"
          >
            <CiMenuBurger color="white" size={24} />
          </Button>
        </div>
      </Flex>
      {/* Mobile Drawer */}
      <Drawer
        title="Menu"
        placement={placement}
        width={300}
        onClose={onClose}
        open={open}
        className="p-0"
      >
        <Flex vertical gap={4} className="p-0">
          <Button
            type="text"
            onClick={() => {
              navigate("/");
              onClose();
            }}
            className="text-left h-auto py-3 flex items-center"
          >
            <span className="text-lg">Home</span>
          </Button>

          <Button
            type="text"
            className="text-left h-auto py-3 flex items-center"
          >
            <span className="text-lg">Shop by category</span>
          </Button>

          <Button
            type="text"
            className="text-left h-auto py-3 flex items-center"
          >
            <span className="text-lg">Shop by collection</span>
          </Button>

          <div className="h-px bg-gray-200 my-2"></div>

          <Button
            type="text"
            className="text-left h-auto py-3 flex items-center"
            icon={<IoMailOutline size={20} className="mr-2" />}
          >
            <span className="text-lg">Contact Us</span>
          </Button>

          {userLoggedIn && (
            <Button
              type="text"
              onClick={handleCart}
              className="text-left h-auto py-3 flex items-center"
              icon={<IoCartOutline size={20} className="mr-2" />}
            >
              <span className="text-lg">My Cart</span>
              {cartItems?.items?.length > 0 && (
                <Badge count={cartItems.items.length} className="ml-2" />
              )}
            </Button>
          )}

          {!userLoggedIn ? (
            <Button
              type="text"
              onClick={handleLogin}
              className="text-left h-auto py-3 flex items-center"
              icon={<MdAccountCircle size={20} className="mr-2" />}
            >
              <span className="text-lg">Login / Register</span>
            </Button>
          ) : (
            <Button
              type="text"
              onClick={handleLogout}
              className="text-left h-auto py-3 flex items-center danger"
              icon={<MdAccountCircle size={20} className="mr-2" />}
            >
              <span className="text-lg">Logout</span>
            </Button>
          )}
        </Flex>
      </Drawer>
    </div>
  );
};
