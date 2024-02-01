interface InputFormProps {
  label: string;
  value: string;
  setValue: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
}

export const InputForm = (props: InputFormProps) => {
  const { label, value, setValue, placeholder, type, required, disabled } = props;
  return (
    <div className="flex flex-col justify-left w-64">
      <div className="text-md font-inter">{label}</div>
      <input
        className="bg-form border-b border-secondary w-full h-10 pl-2 disabled:bg-gray"
        onChange={(e) => setValue(e.target.value)}
        value={value}
        placeholder={placeholder}
        type={type || "text"}
        required={required}
        disabled={disabled}
      />
    </div>
  );
};
