interface InputFormProps {
  label: string;
  value: string;
  setValue: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
  w?: string;
}

export const InputForm = (props: InputFormProps) => {
  const { label, value, setValue, placeholder, type, required, disabled, w } =
    props;
  const width = w || "w-64";
  return (
    <div className={`flex flex-col justify-left ${width}`}>
      <div className="text-md">{label}</div>
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