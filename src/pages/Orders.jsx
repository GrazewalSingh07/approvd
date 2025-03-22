import { Select, Input } from "antd";
import React, { useState } from "react";
import { OrdersAccordion } from "../customComponents/OrdersAccordion";
import { getUserOrders } from "../services/orders.service";
import { useQuery } from "@tanstack/react-query";

const { Search } = Input;

export const Orders = () => {
  const { data: orders, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: getUserOrders,
  });

  // State for filters and search
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  // Status options for filter
  const statusOptions = [
    { value: "all", label: "All" },
    { value: "pending", label: "Pending" },
    { value: "processing", label: "Processing" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
  ];

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
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
  const filteredOrders = orders?.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Orders</h1>

      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <div className="w-full md:w-1/2">
          <Search
            placeholder="Seach by order ID, customer name or email..."
            allowClear
            classNames="bg-white w-full"
            size="large"
          />
        </div>

        <div className="w-full md:w-1/4">
          <Select
            defaultValue="all"
            className="w-full"
            onChange={setStatusFilter}
            options={statusOptions}
            size="large"
          />
        </div>
      </div>

      <OrdersAccordion filteredOrders={filteredOrders} />
    </div>
  );
};
