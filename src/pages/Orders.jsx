import { Select, Input } from 'antd';
import React, { useState } from 'react';
import { OrdersAccordion } from '../customComponents/OrdersAccordion';

const { Search } = Input;

export const Orders = () => {
  const [orders, setOrders] = useState([
    {
      id: '1001',
      date: '2025-03-05',
      customer: 'John Doe',
      email: 'john.doe@example.com',
      items: [
        { name: 'Wireless Headphones', price: 89.99, quantity: 1 },
        { name: 'Phone Case', price: 24.99, quantity: 1 }
      ],
      total: 114.98,
      status: 'delivered',
      paymentMethod: 'Credit Card'
    },
    {
      id: '1002',
      date: '2025-03-07',
      customer: 'Jane Smith',
      email: 'jane.smith@example.com',
      items: [
        { name: 'Smart Watch', price: 199.99, quantity: 1 }
      ],
      total: 199.99,
      status: 'processing',
      paymentMethod: 'PayPal'
    },
    {
      id: '1003',
      date: '2025-03-08',
      customer: 'Robert Johnson',
      email: 'robert.j@example.com',
      items: [
        { name: 'Laptop Sleeve', price: 34.99, quantity: 1 },
        { name: 'USB-C Cable', price: 12.99, quantity: 2 },
        { name: 'Wireless Mouse', price: 45.99, quantity: 1 }
      ],
      total: 106.96,
      status: 'shipped',
      paymentMethod: 'Credit Card'
    },
    {
      id: '1004',
      date: '2025-03-09',
      customer: 'Emily Davis',
      email: 'emily.d@example.com',
      items: [
        { name: 'Bluetooth Speaker', price: 79.99, quantity: 1 }
      ],
      total: 79.99,
      status: 'pending',
      paymentMethod: 'Bank Transfer'
    }
  ]);

  // State for filters and search
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  // Status options for filter
  const statusOptions = [{ value: 'all', label: 'All' }, { value: 'pending', label: 'Pending' }, { value: 'processing', label: 'Processing' }, { value: 'shipped', label: 'Shipped' }, { value: 'delivered', label: 'Delivered' }];

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Handle expanding/collapsing order details
  const toggleOrderDetails = (orderId) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
    } else {
      setExpandedOrderId(orderId);
    }
  };

  // Filter orders based on search term and status filter
  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Orders</h1>

      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <div className="w-full md:w-1/2">
          <Search placeholder="Seach by order ID, customer name or email..." allowClear classNames='bg-white w-full' size='large' />
        </div>

        <div className="w-full md:w-1/4">
          <Select
            defaultValue="all"
            className='w-full'
            onChange={setStatusFilter}
            options={statusOptions}
            size='large'
          />
        </div>
      </div>

      <OrdersAccordion filteredOrders={filteredOrders} />
    </div>
  );
};
