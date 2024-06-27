// ViewModeSwitch.tsx

import { Switch } from "antd";
import { ScheduleOutlined, TableOutlined } from '@ant-design/icons';

interface ViewModeSwitchProps {
  viewMode: string;
  onViewModeChange: (mode: string) => void;
}

const ViewModeSwitch: React.FC<ViewModeSwitchProps> = ({ viewMode, onViewModeChange }) => {
  const handleChange = (checked: boolean) => {
    onViewModeChange(checked ? "timetable" : "table");
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <Switch
        checkedChildren={<ScheduleOutlined />}
        unCheckedChildren={<TableOutlined />}
        checked={viewMode === "timetable"}
        onChange={handleChange}
      />
      {viewMode === "timetable" ? " Timetable View" : " Table View"}
    </div>
  );
};

export default ViewModeSwitch;
