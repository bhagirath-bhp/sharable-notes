import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectItemProps {
  value?: string;
  label?: string;
}

interface DynamicSelectProps {
  items?: SelectItemProps[];
  placeholder?: string;
  onChange?: (value: string) => void; // Add onChange prop
}

const DynamicSelect: React.FC<DynamicSelectProps> = ({ items, placeholder, onChange }) => {
  return (
    <Select onValueChange={onChange}> {/* Use onValueChange for handling selection */}
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={placeholder || ""} />
      </SelectTrigger>
      <SelectContent>
        {items?.map((item, index) => (
          <SelectItem key={index} value={item.value || ""}>
            {item.label || ""}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default DynamicSelect;
