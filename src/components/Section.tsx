export const Section = (props: { label: string }) => {
  return (
    <div className="relative border-b border-primary">
      <div className="absolute -top-8 flex flex-col items-center border-b-8 border-primary w-48">
        <div className="text-2xl font-bold font-inter">{props.label}</div>
      </div>
    </div>
  );
};
