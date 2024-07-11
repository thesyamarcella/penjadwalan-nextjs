import React from "react";
import { Checkbox } from "antd";

interface PreferenceCheckboxProps {
  slotId: number;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const PreferenceCheckbox: React.FC<PreferenceCheckboxProps> = ({ slotId, checked, onChange }) => (
  <Checkbox checked={checked} onChange={(e) => onChange(e.target.checked)}>
    {slotId}
  </Checkbox>
);

export default PreferenceCheckbox;
