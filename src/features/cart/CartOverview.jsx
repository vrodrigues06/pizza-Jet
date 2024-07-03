import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getTotalCartPrice, getTotalCartQuantity } from './cartSlice';
import { formatCurrency } from '../../utilities/helpers';

function CartOverview() {
  const totalCartQuantity = useSelector(getTotalCartQuantity);

  const totalCartPrice = useSelector(getTotalCartPrice);

  if (totalCartQuantity === 0) return null;

  return (
    <div className="flex items-center justify-between bg-stone-800 p-4 text-sm uppercase text-stone-200 sm:p-6 sm:px-16 md:text-base">
      <p className="space-x-4 font-semibold text-stone-400 sm:space-x-6">
        <span>
          {totalCartQuantity}
          {totalCartQuantity === 1
            ? ' pizza'
            : totalCartQuantity > 1
              ? ' pizzas'
              : ''}{' '}
        </span>
        <span>{totalCartQuantity > 0 && formatCurrency(totalCartPrice)}</span>
      </p>
      <Link to="/cart">Open cart &rarr;</Link>
    </div>
  );
}

export default CartOverview;
