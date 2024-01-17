interface InputFormProps {
  label: string;
  value: string;
  setValue: (value: string) => void;
  type?: string;
}

export const InputForm = (props: InputFormProps) => {
  const { label, value, setValue, type } = props;
  return (
    <div className="flex flex-col justify-left w-72 pt-5">
      <div className="text-md font-inter">{label}</div>
      <input
        className="bg-form border-b border-secondary w-full h-10"
        type={type ? type : "text"}
        onChange={e => setValue(e.target.value)}
        value={value}
      />
    </div>
  );
};
