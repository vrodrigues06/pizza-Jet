import React from 'react';
import { useNavigate } from 'react-router-dom';

const SearchOrder = () => {
  const [query, setQuery] = React.useState('');
  const navigate = useNavigate();
  function handleSubmit(e) {
    e.preventDefault();

    if (!query) return;

    navigate(`/order/${query}`);
    setQuery('');
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        className="w-32 rounded-full bg-yellow-50 px-4 py-2 text-sm transition-all duration-300 placeholder:text-stone-400 focus:w-48 focus:outline-none focus:ring focus:ring-yellow-400 focus:ring-opacity-50 sm:w-48 sm:focus:w-72 md:w-72 md:text-base"
        placeholder="Search order #"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </form>
  );
};

export default SearchOrder;
