// PreferenceCheckbox.tsx
import React from "react";
import { Checkbox } from "antd";

interface PreferenceCheckboxProps {
  slotId: number;
  day: string;
  startTime: string;
  endTime: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const PreferenceCheckbox: React.FC<PreferenceCheckboxProps> = ({ slotId, day, startTime, endTime, checked, onChange }) => (
  <Checkbox
    checked={checked}
    onChange={(e) => onChange(e.target.checked)}
  >
    {`${day} ${startTime} - ${endTime}`}
  </Checkbox>
);

export default PreferenceCheckbox;
