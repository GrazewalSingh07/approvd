import React from 'react';
import { Collapse, Table } from 'antd';
import { formattedPrice } from '../utils/formattedPrice';
import { format } from 'date-fns';

export const OrdersAccordion = ({ filteredOrders }) => {
  const columns = [
    {
      title: 'Product',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      align: 'right',
      render: (price) => `${formattedPrice(price)}`,
    },
    {
      title: 'Qty',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'right',
    },
    {
      title: 'Subtotal',
      dataIndex: 'subtotal',
      key: 'subtotal',
      align: 'right',
      render: (_, record) => `${formattedPrice(record.totalPrice * record.quantity)}`,
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date) => {
    const createdAtDate = new Date(date?.seconds * 1000 + date?.nanoseconds / 1000000);
    return format(createdAtDate, "dd MMM yyyy");
  };

  const items = filteredOrders?.map(order => ({
    key: order.id.toString(),
    label: (
      <>
        <div
          className="cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between"
        >
          <div className="mb-2 sm:mb-0">
            <span className="font-medium text-gray-900">#{order.id}</span>
            <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
          </div>

          <div className="mb-2 sm:mb-0">
            <p className="font-medium text-gray-900">{order.customer}</p>
            <p className="text-sm text-gray-500">{order.email}</p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="text-gray-900 font-medium">{formattedPrice(order.totalPrice)}</span>
            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
              {order.status}
            </span>
          </div>
        </div>
      </>
    ),
    children: (
      <Table
        dataSource={order.items.map(item => ({ ...item, key: item.id }))}
        columns={columns}
        pagination={false}
      />
    ),
  }));

  if (filteredOrders?.length > 0) {
    return <Collapse items={items} />;
  } else {
    return (
      <div className="p-8 text-center text-gray-500">No orders found matching your filters.</div>
    );
  }

};
