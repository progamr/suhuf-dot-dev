'use client';

import Select, { MultiValue, StylesConfig } from 'react-select';

export interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: Option[];
  value: Option[];
  onChange: (selected: Option[]) => void;
  placeholder?: string;
  isLoading?: boolean;
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  isLoading = false,
}: MultiSelectProps) {
  const handleChange = (newValue: MultiValue<Option>) => {
    onChange(Array.from(newValue));
  };

  // Custom styles for dark mode support
  const customStyles: StylesConfig<Option, true> = {
    control: (base, state) => ({
      ...base,
      backgroundColor: 'hsl(var(--background))',
      borderColor: state.isFocused ? 'hsl(var(--primary))' : 'hsl(var(--border))',
      boxShadow: state.isFocused ? '0 0 0 1px hsl(var(--primary))' : 'none',
      '&:hover': {
        borderColor: 'hsl(var(--primary))',
      },
      minHeight: '42px',
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: 'hsl(var(--background))',
      border: '1px solid hsl(var(--border))',
      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? 'hsl(var(--primary))'
        : state.isFocused
        ? 'hsl(var(--accent))'
        : 'transparent',
      color: state.isSelected ? 'hsl(var(--primary-foreground))' : 'hsl(var(--foreground))',
      '&:active': {
        backgroundColor: 'hsl(var(--primary))',
      },
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: 'hsl(var(--primary) / 0.1)',
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: 'hsl(var(--foreground))',
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: 'hsl(var(--foreground))',
      '&:hover': {
        backgroundColor: 'hsl(var(--destructive))',
        color: 'hsl(var(--destructive-foreground))',
      },
    }),
    input: (base) => ({
      ...base,
      color: 'hsl(var(--foreground))',
    }),
    placeholder: (base) => ({
      ...base,
      color: 'hsl(var(--muted-foreground))',
    }),
    singleValue: (base) => ({
      ...base,
      color: 'hsl(var(--foreground))',
    }),
  };

  return (
    <Select
      isMulti
      options={options}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      isLoading={isLoading}
      styles={customStyles}
      className="react-select-container"
      classNamePrefix="react-select"
      closeMenuOnSelect={false}
      hideSelectedOptions={false}
      isClearable
    />
  );
}
