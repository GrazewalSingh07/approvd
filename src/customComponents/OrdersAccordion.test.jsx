import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { OrdersAccordion } from "./OrdersAccordion";
import { formattedPrice } from "../utils/formattedPrice";
import { format } from "date-fns";
import "@testing-library/jest-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock window.getComputedStyle
window.getComputedStyle = vi.fn().mockImplementation((element) => {
  return {
    getPropertyValue: (prop) => {
      return "";
    },
    length: 0,
    parentRule: null,
  };
});

// Mock the external dependencies
vi.mock("../utils/formattedPrice", () => ({
  formattedPrice: vi.fn((price) => `$${price.toFixed(2)}`),
}));

describe("OrdersAccordion", () => {
  // Mock data for testing
  const mockOrders = [
    {
      id: "12345",
      createdAt: { seconds: 1625097600, nanoseconds: 0 },
      customer: "John Doe",
      email: "john@example.com",
      status: "delivered",
      totalPrice: 100,
      items: [
        {
          id: "item1",
          name: "Product 1",
          price: 50,
          quantity: 2,
          totalPrice: 50,
        },
      ],
    },
    {
      id: "67890",
      createdAt: { seconds: 1625184000, nanoseconds: 0 },
      customer: "Jane Smith",
      email: "jane@example.com",
      status: "pending",
      totalPrice: 75.5,
      items: [
        {
          id: "item2",
          name: "Product 2",
          price: 75.5,
          quantity: 1,
          totalPrice: 75.5,
        },
      ],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders accordion with orders correctly", () => {
    render(<OrdersAccordion filteredOrders={mockOrders} />);

    // Check if order IDs are displayed
    expect(screen.getByText("#12345")).toBeInTheDocument();
    expect(screen.getByText("#67890")).toBeInTheDocument();

    // Check if customer names are displayed
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();

    // Check if emails are displayed
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("jane@example.com")).toBeInTheDocument();

    // Check if statuses are displayed
    expect(screen.getByText("delivered")).toBeInTheDocument();
    expect(screen.getByText("pending")).toBeInTheDocument();

    // Check if formatted prices are displayed
    expect(screen.getByText("$100.00")).toBeInTheDocument();
    expect(screen.getByText("$75.50")).toBeInTheDocument();

    // Check dates are formatted correctly
    const date1 = format(new Date(1625097600 * 1000), "dd MMM yyyy");
    const date2 = format(new Date(1625184000 * 1000), "dd MMM yyyy");
    expect(screen.getByText(date1)).toBeInTheDocument();
    expect(screen.getByText(date2)).toBeInTheDocument();
  });

  it("expands accordion and shows order items when clicked", () => {
    render(<OrdersAccordion filteredOrders={mockOrders} />);

    // Initially, order items should not be visible
    expect(screen.queryByText("Product 1")).not.toBeInTheDocument();

    // Click on the first accordion item
    fireEvent.click(screen.getByText("#12345"));

    // Now, the items should be visible
    expect(screen.getByText("Product 1")).toBeInTheDocument();
    expect(screen.getByText("Product")).toBeInTheDocument(); // Table header
    expect(screen.getByText("Price")).toBeInTheDocument(); // Table header
    expect(screen.getByText("Qty")).toBeInTheDocument(); // Table header
    expect(screen.getByText("Subtotal")).toBeInTheDocument(); // Table header
  });

  it("applies correct status colors based on order status", () => {
    render(<OrdersAccordion filteredOrders={mockOrders} />);

    // Find status elements
    const deliveredStatus = screen.getByText("delivered").closest("span");
    const pendingStatus = screen.getByText("pending").closest("span");

    // Check if correct classes are applied
    expect(deliveredStatus).toHaveClass("bg-green-100");
    expect(deliveredStatus).toHaveClass("text-green-800");
    expect(pendingStatus).toHaveClass("bg-gray-100");
    expect(pendingStatus).toHaveClass("text-gray-800");
  });

  it("displays different order statuses with appropriate styling", () => {
    const ordersWithDifferentStatuses = [
      {
        ...mockOrders[0],
        id: "1",
        status: "shipped",
      },
      {
        ...mockOrders[0],
        id: "2",
        status: "processing",
      },
    ];

    render(<OrdersAccordion filteredOrders={ordersWithDifferentStatuses} />);

    const shippedStatus = screen.getByText("shipped").closest("span");
    const processingStatus = screen.getByText("processing").closest("span");

    expect(shippedStatus).toHaveClass("bg-blue-100");
    expect(shippedStatus).toHaveClass("text-blue-800");
    expect(processingStatus).toHaveClass("bg-yellow-100");
    expect(processingStatus).toHaveClass("text-yellow-800");
  });

  it('shows "No orders found" message when filteredOrders is empty', () => {
    render(<OrdersAccordion filteredOrders={[]} />);
    expect(
      screen.getByText("No orders found matching your filters."),
    ).toBeInTheDocument();
  });

  it("calculates and displays correct subtotals for order items", () => {
    render(<OrdersAccordion filteredOrders={mockOrders} />);

    // Expand the first order
    fireEvent.click(screen.getByText("#12345"));

    // Check if formattedPrice was called with correct subtotal (50 * 2 = 100)
    expect(formattedPrice).toHaveBeenCalledWith(100);
  });
});
