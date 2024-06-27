import React from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

interface SearchBarProps {
  searchText: string;
  onSearch: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchText, onSearch }) => (
  <Input
    placeholder="Search"
    prefix={<SearchOutlined />}
    value={searchText}
    onChange={(e) => onSearch(e.target.value)}
    style={{ marginBottom: 16, width: 300 }}
  />
);

export default SearchBar;
