import { Badge, Button, Drawer, Dropdown, Flex, Space, Tooltip, message } from 'antd'
import React, { useState } from 'react'
import { IoCartOutline, IoMailOutline } from 'react-icons/io5';
import { MdAccountCircle } from 'react-icons/md';
import { CiMenuBurger } from "react-icons/ci";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';
import { doSignOut } from '../../firebase/auth';
import { useQuery } from '@tanstack/react-query';
import { getCartData } from '../../services/cart.service';
import toast from 'react-hot-toast';

export const Navbar = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState('right');
  const { userLoggedIn } = useAuth()

  const { data: cartItems } = useQuery({ queryKey: ['cart'], queryFn: getCartData })

  const showDrawer = () => {
    setOpen(true);
  };
  const navigate = useNavigate()
  const onChange = (e) => {
    setPlacement(e.target.value);
  };
  const onClose = () => {
    setOpen(false);
  };
  const handleCart = () => {
    setOpen(false);
    navigate("/cart")
  }

  const handleLogin = (e) => {
    setOpen(false);
    navigate("/login")
  }
  const handleLogout = () => {
    setOpen(false);
    doSignOut()
    toast.success('Logged out');
  }
  return (
    <div className='bg-black py-2 px-4'>
      <Flex justify='space-between' >
        <Space onClick={() => navigate("/")} className='md:hidden max-md:visible'>
          <img className=' w-12' src="/logo-preview.png" />
        </Space>
        <Space >
          <Dropdown
            align={'center'}
            dropdownRender={() => (
              <div style={{ width: '100vw', left: 0, position: 'relative', top: 0 }}>
                <div style={{ backgroundColor: 'white', padding: '10px 20px' }}>
                  <Button>
                    hii
                  </Button>
                </div>
              </div>
            )}
            trigger={['hover']}
          >

            <a>
              <Space>
                <p onClick={(e) => e.preventDefault()} className='hover:underline text-white pr-4 underline-offset-[6px] max-sm:text-[12px] text-lg'>
                  Shop by category
                </p>
              </Space>
            </a>
          </Dropdown>
          <Dropdown
            align={'center'}
            dropdownRender={(menu) => (
              <div style={{ width: '100vw', left: 0, position: 'relative', top: 0 }}>
                <div style={{ backgroundColor: 'white', padding: '10px 20px' }}>{menu}</div>
              </div>
            )}
            trigger={['hover']}
          >
            <a>
              <Space>
                <p onClick={(e) => e.preventDefault()} className='hover:underline  text-white max-sm:text-[12px] underline-offset-[6px]'>
                  Shop by collection
                </p>
              </Space>
            </a>
          </Dropdown>

        </Space>
        <Space onClick={() => navigate("/")} className='md:visible max-md:hidden  cursor-pointer'>
          <img className=' w-32' src="/logo-preview.png" />
        </Space>

        <Space className='visible max-md:hidden'>
          <Tooltip className='cursor-pointer' placement="bottomLeft" title={'Contact us'} >
            <IoMailOutline color='white' size={32} />

          </Tooltip>
          {userLoggedIn && <Badge count={cartItems?.items?.length}><Tooltip onClick={() => navigate("/cart")} className='cursor-pointer' placement="bottomLeft" title={'My cart'} >
            <IoCartOutline color='white' size={32} />
          </Tooltip></Badge>}

          {!userLoggedIn && <Tooltip onClick={() => navigate("/login")} className='cursor-pointer' placement="bottomLeft" title={'Login/Register'} >
            <MdAccountCircle color='white' size={32} />
          </Tooltip>}
          {userLoggedIn && <Tooltip onClick={handleLogout} className='cursor-pointer' placement="bottomLeft" title={'Logout'} >   <MdAccountCircle color='white' size={32} />
          </Tooltip>
          }


        </Space>


        <Space className='md:hidden visible'>
          <Button size='large' type="text" onClick={showDrawer}>
            <CiMenuBurger color='white' />
          </Button>
        </Space>

      </Flex>
      <Drawer
        title="My Menu"
        placement={placement}
        width={500}
        onClose={onClose}
        open={open}

      >

        <Space >
          <Flex gap={8} vertical>

            <Flex align='center' gap={4}> <IoMailOutline size={32} /> <span >Contact Us</span>
            </Flex>

            {userLoggedIn && <Flex align='center' onClick={handleCart} gap={4}>  <IoCartOutline size={32} /><span >Cart</span>
            </Flex>}



            {!userLoggedIn && <Flex align='center' onClick={handleLogin} gap={4}>    <MdAccountCircle size={32} /><span >Login / Register</span>
            </Flex>

            }
            {userLoggedIn && <Flex align='center' onClick={handleLogout} gap={4}>    <MdAccountCircle size={32} /><span >Logout</span>
            </Flex>

            }

          </Flex>
        </Space>
      </Drawer>
    </div>
  )
}
