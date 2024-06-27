// import React, { useState } from 'react';
// import { Table, Input, Form, Popconfirm, Typography } from 'antd';
// import { DataType } from '../interfaces';

// interface EditableCellProps {
//   title: string;
//   editable: boolean;
//   children: React.ReactNode;
//   dataIndex: keyof DataType;
//   record: DataType;
//   onSave: () => void;
// }

// const EditableCell: React.FC<EditableCellProps> = ({
//   title,
//   editable,
//   children,
//   dataIndex,
//   record,
//   onSave,
// }) => {
//   const [editing, setEditing] = useState(false);
//   const inputRef = React.useRef<Input | null>(null);

//   const toggleEdit = () => {
//     setEditing(!editing);
//   };

//   const handleSave = () => {
//     onSave();
//     setEditing(false);
//   };

//   let childNode = children;

//   if (editable) {
//     childNode = editing ? (
//       <Form.Item
//         style={{ margin: 0 }}
//         name={dataIndex as string}
//         rules={[
//           {
//             required: true,
//             message: `${title} is required.`,
//           },
//         ]}
//       >
//         <Input ref={inputRef} onPressEnter={handleSave} onBlur={handleSave} />
//       </Form.Item>
//     ) : (
//       <div className="editable-cell-value-wrap" style={{ paddingRight: 24 }} onClick={toggleEdit}>
//         {children}
//       </div>
//     );
//   }

//   return <td>{childNode}</td>;
// };

// interface EditableTableProps {
//   columns: any[]; // Customize this to match your column structure
//   data: DataType[];
//   onSave: (key: React.Key) => void;
// }

// const EditableTable: React.FC<EditableTableProps> = ({ columns, data, onSave }) => {
//   const [form] = Form.useForm();

//   const handleSave = (record: DataType) => {
//     form.validateFields().then((values) => {
//       onSave(record.id); // Assuming record.id is the key
//     });
//   };

//   const mergedColumns = columns.map((col) => ({
//     ...col,
//     render: (text: any, record: DataType) => (
//       <EditableCell
//         editable={col.editable}
//         title={col.title}
//         dataIndex={col.dataIndex}
//         record={record}
//         onSave={() => handleSave(record)}
//       >
//         {text}
//       </EditableCell>
//     ),
//   }));

//   return (
//     <Form form={form} component={false}>
//       <Table
//         components={{
//           body: {
//             cell: EditableCell,
//           },
//         }}
//         bordered
//         dataSource={data}
//         columns={mergedColumns}
//         rowClassName="editable-row"
//         pagination={false}
//       />
//     </Form>
//   );
// };

// export default EditableTable;
