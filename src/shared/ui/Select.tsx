import styles from "./Select.module.css";

type SelectOption = {
  label: string;
  value: string;
};

type SelectProps = {
  onChange: (value: string) => void;
  options: SelectOption[];
  value: string;
};

export function Select({ onChange, options, value }: SelectProps) {
  return (
    <select
      className={styles.control}
      onChange={(event) => onChange(event.target.value)}
      value={value}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
