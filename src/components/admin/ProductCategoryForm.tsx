import { useState } from 'react';
import axios from 'axios';

import { Form, Input, Button } from 'antd';

const ProductCategoryForm = () => {
  const [form] = Form.useForm();

  const handleFinish = async (values: { name: string }) => {
    await axios.post('/api/product-categories', values);
    form.resetFields();
  };

  return (
    <Form form={form} onFinish={handleFinish}>
      <Form.Item
        label="Category Name"
        name="name"
        rules={[{ required: true, message: 'Please input category name!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">Add Category</Button>
      </Form.Item>
    </Form>
  );
};

export default ProductCategoryForm;