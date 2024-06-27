import React from 'react';
import { Modal, Form, Input } from 'antd';

interface ModalFormProps<T> {
  visible: boolean;
  isEditModal: boolean;
  initialValues?: T ;
  onOk: () => void;
  onCancel: () => void;
  formItems: Array<{ name: string, label: string, rules?: any[] }>;
  form: any;
  isEdit: boolean
}

const ModalForm = <T extends object>({ visible, isEditModal, initialValues, onOk, onCancel, formItems, form }: ModalFormProps<T>) => (
  <Modal
    title={isEditModal ? 'Edit Record' : 'Add Record'}
    visible={visible}
    onOk={onOk}
    onCancel={onCancel}
  >
    <Form form={form} layout="vertical" initialValues={initialValues}>?
      {formItems.map(item => (
        <Form.Item key={item.name} name={item.name} label={item.label} rules={item.rules}>
          <Input />
        </Form.Item>
      ))}
    </Form>
  </Modal>
);

export default ModalForm;
