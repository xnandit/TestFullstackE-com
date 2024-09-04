import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Product {
  id: number;
  plu: string;
  name: string;
  product_category_id: number;
  active: boolean;
  created_user: string;
  created_date: string;
  updated_user?: string;
  updated_date?: string;
}

interface ProductState {
  products: Product[];
}

const initialState: ProductState = {
  products: [],
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setProducts(state, action: PayloadAction<Product[]>) {
      state.products = action.payload;
    },
    addProduct(state, action: PayloadAction<Product>) {
      state.products.push(action.payload);
    },
    updateProduct(state, action: PayloadAction<Product>) {
      const index = state.products.findIndex(product => product.id === action.payload.id);
      if (index !== -1) {
        state.products[index] = action.payload;
      }
    },
    removeProduct(state, action: PayloadAction<number>) {
      state.products = state.products.filter(product => product.id !== action.payload);
    },
  },
});

export const { setProducts, addProduct, updateProduct, removeProduct } = productSlice.actions;

export default productSlice.reducer;
