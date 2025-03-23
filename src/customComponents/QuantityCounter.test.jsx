import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { QuantityCounter } from "./QuantityCounter";
import { describe, it, expect, vi, beforeEach } from "vitest";
import "@testing-library/jest-dom";

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

describe("QuantityCounter", () => {
  let mockSetQuantity;

  beforeEach(() => {
    mockSetQuantity = vi.fn();
  });

  it("renders correctly with initial quantity", () => {
    render(<QuantityCounter quantity={3} setQuantity={mockSetQuantity} />);

    // Check if buttons are rendered - Ant Design buttons have specific class
    const incrementButton = screen.getByRole("button", { name: "+" });
    const decrementButton = screen.getByRole("button", { name: "-" });

    expect(incrementButton).toBeInTheDocument();
    expect(decrementButton).toBeInTheDocument();

    // InputNumber displays the value
    const input = screen.getByRole("spinbutton");
    expect(input).toHaveValue("3");
  });

  it("increments quantity when + button is clicked", () => {
    render(<QuantityCounter quantity={3} setQuantity={mockSetQuantity} />);

    // Click the increment button
    const incrementButton = screen.getByRole("button", { name: "+" });
    fireEvent.click(incrementButton);

    // Check if setQuantity was called with incremented value
    expect(mockSetQuantity).toHaveBeenCalledWith(4);
  });

  it("decrements quantity when - button is clicked and quantity > 1", () => {
    render(<QuantityCounter quantity={3} setQuantity={mockSetQuantity} />);

    // Click the decrement button
    const decrementButton = screen.getByRole("button", { name: "-" });
    fireEvent.click(decrementButton);

    // Check if setQuantity was called with decremented value
    expect(mockSetQuantity).toHaveBeenCalledWith(2);
  });

  it("does not decrement quantity when - button is clicked and quantity is 1", () => {
    render(<QuantityCounter quantity={1} setQuantity={mockSetQuantity} />);

    // Click the decrement button
    const decrementButton = screen.getByRole("button", { name: "-" });
    fireEvent.click(decrementButton);

    // Check that setQuantity was not called
    expect(mockSetQuantity).not.toHaveBeenCalled();
  });

  it("has the correct container structure", () => {
    render(<QuantityCounter quantity={3} setQuantity={mockSetQuantity} />);

    // Check if container has flex and spacing classes
    const container = screen.getByRole("button", { name: "+" }).closest("div");
    expect(container).toHaveClass("flex");
    expect(container).toHaveClass("items-center");
    expect(container).toHaveClass("space-x-2");
  });
});
