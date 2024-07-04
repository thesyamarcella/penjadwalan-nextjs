import React from 'react';
import { Modal, Form, Input, Switch, Select } from 'antd';
import { formItemsMap } from '../config';
import { DataType } from '../types/type';

interface ModalFormProps {
  visible: boolean;
  onCancel: () => void;
  onOk: (values: any) => void;
  form: any;
  isEdit: boolean;
  view: string;
}

const ModalForm: React.FC<ModalFormProps> = ({ visible, onCancel, onOk, form, isEdit, view }) => {
  const formItems = formItemsMap[view] || [];

  return (
    <Modal
      visible={visible}
      title={isEdit ? 'Edit Data' : 'Add Data'}
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values: DataType) => {
            form.resetFields();
            onOk(values);
          })
          .catch((info: any) => {
            console.log('Validate Failed:', info);
          });
      }}
    >
      <Form form={form} layout="vertical">
        {formItems.map((item) => (
          <Form.Item key={item.name} name={item.name} label={item.label} rules={item.rules} valuePropName={item.valuePropName}>
            {item.type === 'switch' ? ( 
              <Switch />
            ) : item.type === 'select' ? (
              <Select
                options={item.options?.map((option) => ({
                  label: option.label,
                  value: option.value,
                }))}
              />
            ) : (
              <Input type={item.type} />  
            )}
          </Form.Item>
        ))}
      </Form>
    </Modal>
  );
};

export default ModalForm;
