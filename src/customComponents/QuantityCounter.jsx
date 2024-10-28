import React, { useState } from 'react';
import { Button, InputNumber } from 'antd'; // Import Ant Design components

export const QuantityCounter = ({ onQuantityChange,quantity, setQuantity }) => {
   

    const increment = () => {
        const newQuantity = quantity + 1;
        setQuantity(newQuantity);
        onQuantityChange(newQuantity);
    };

    const decrement = () => {
        if (quantity > 1) {
            const newQuantity = quantity - 1;
            setQuantity(newQuantity);
            onQuantityChange(newQuantity);
        }
    };

    const handleChange = (value) => {
        const newQuantity = Math.max(1, value || 1);
        setQuantity(newQuantity);
        onQuantityChange(newQuantity);
    };

    return (
        <div className="flex items-center space-x-2">
            <Button onClick={decrement} type="default">
                -
            </Button>
            <InputNumber 
                min={1} 
                value={quantity} 
                onChange={handleChange} 
                style={{ width: '40px' }} // Adjust width as needed
            />
            <Button onClick={increment} type="default">
                +
            </Button>
        </div>
    );
};

 
