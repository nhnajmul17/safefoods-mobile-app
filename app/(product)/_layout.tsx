import { Stack } from 'expo-router';
import React from 'react';

const ProductDetailsLayout = () => {
    return (
        <Stack>
            <Stack.Screen
                name="product-details"
                options={{
                    title: 'Product Details',
                    headerShown: true,
                }}
            />
        </Stack>
    );
};

export default ProductDetailsLayout;
