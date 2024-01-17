interface SearchBoxProps {
  query: string;
  setQuery: (query: string) => void;
  onClick: () => void;
}

export const SearchBox = (props: SearchBoxProps) => {
  const { query, setQuery, onClick } = props;
  return (
    <div className="flex flex-row justify-center py-5 w-full">
      <input
        className="border boreder-primary w-2/3 h-10 pl-3"
        type="text"
        onChange={e => setQuery(e.target.value)}
        value={query}
        placeholder="Find datasets by keywords"
      />
      <button
        className="material-symbols-outlined text-primary border-b border-t border-r border-primary w-16 h-10"
        onClick={onClick}
      >
        search
      </button>
    </div>
  );
}