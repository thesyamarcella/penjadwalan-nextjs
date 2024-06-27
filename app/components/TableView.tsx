import React from 'react';
import { Table, Button } from 'antd';
import { EditOutlined, SettingOutlined } from '@ant-design/icons';

interface TableViewProps<T> {
  data: T[];
  columns: any[];
  loading: boolean;
  onEdit: (record: T) => void;
}

const TableView = <T extends object>({ data, columns, loading, onEdit }: TableViewProps<T>) => (
  <Table
    columns={[
      ...columns,
      {
        title: 'Actions',
        key: 'actions',
        fixed: 'right' as const,
        render: (text: any, record: T) => (
          <span>
            <Button
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
              style={{ marginRight: 8 }}
            />
          </span>
        ),
      },
    ]}
    dataSource={data}
    loading={loading}
    rowKey="id"
    scroll={{ x: true, y: 400 }}
  />
);

export default TableView;
