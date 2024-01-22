interface RadioProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: () => void;
}

export const Radio = (props: RadioProps) => {
  const { id, label, checked, onChange } = props;
  return (
    <div className="flex flex-row items-center p-2 gap-3">
      <input
        type="radio"
        value={id}
        id={id}
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 accent-primary"
      />
      <label className="font-bold font-inter text-lg" htmlFor={id}>
        {label}
      </label>
    </div>
  );
};

export const RadioThin = (props: RadioProps) => {
  const { id, label, checked, onChange } = props;
  return (
    <div className="flex flex-row items-center p-2 gap-3">
      <input
        type="radio"
        value={id}
        id={id}
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 accent-primary"
      />
      <label className="font-inter text-md" htmlFor={id}>
        {label}
      </label>
    </div>
  );
}