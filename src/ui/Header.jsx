import React from 'react';
import { Link } from 'react-router-dom';
import SearchOrder from '../features/order/SearchOrder';
import Username from '../features/user/Username';
import logo from '../../public/PizzaJetIcon.svg';

const Header = () => {
  return (
    <header className="flex items-center justify-between border-b-2 border-stone-200 bg-yellow-500 px-4 py-3 uppercase sm:px-16">
      <Link
        to="/"
        className="font-serif flex items-center tracking-wide text-red-900"
      >
        <img className="mr-1 w-12 md:w-16" src={logo} alt="" />{' '}
        <span className="bangers ml-0.5 text-2xl tracking-wide md:text-3xl">
          Pizza JET
        </span>
      </Link>

      <SearchOrder />
      <Username />
    </header>
  );
};

export default Header;
