import React from 'react';

import { Form, redirect, useActionData, useNavigation } from 'react-router-dom';
import { createOrder } from '../../services/apiRestaurant';
import Button from '../../ui/Button';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart, getCart, getTotalCartPrice } from '../cart/cartSlice';
import EmptyCart from '../cart/EmptyCart';
import store from '../../store/configureStore';
import { formatCurrency } from '../../utilities/helpers';
import { fetchAddress } from '../user/userSlice';
import location from '/location.svg';

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str,
  );

function CreateOrder() {
  const [priority, setPriority] = React.useState(false);
  const {
    username,
    status: addressStatus,
    position,
    address,
    errorAddress,
  } = useSelector((state) => state.user);
  const navigation = useNavigation();
  const isSubmiting = navigation.state === 'submitting';
  const cart = useSelector(getCart);
  const totalCartPrice = useSelector(getTotalCartPrice);
  const isPriority = priority ? 1.2 : 1;
  const dispatch = useDispatch();
  const isLoadingAddress = addressStatus === 'loading';

  const totalPrice = totalCartPrice * isPriority;

  const formErrors = useActionData();

  if (!cart.length) return <EmptyCart />;

  return (
    <div className="px-4 py-6">
      <h2 className="mb-8 text-xl font-semibold">Ready to order? Lets go!</h2>

      <Form method="POST">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-32">First Name</label>
          <input
            type="text"
            defaultValue={username ? username : ''}
            className="input grow"
            name="customer"
            required
          />
        </div>

        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className={`sm:basis-32 ${formErrors?.phone ? 'mb-8' : ''}`}>
            Phone number
          </label>
          <div className="grow">
            <input className="input w-full" type="tel" name="phone" required />
            {formErrors?.phone && (
              <p className="mt-2 rounded-md bg-red-100 p-2 text-xs text-red-700">
                {formErrors.phone}{' '}
              </p>
            )}
          </div>
        </div>

        <div className="relative mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-32">Address</label>
          <div className="grow">
            <input
              className="input w-full"
              type="text"
              name="address"
              disabled={isLoadingAddress}
              defaultValue={address}
              required
            />
            {addressStatus === 'error' && (
              <p className="mt-2 rounded-md bg-red-100 p-2 text-xs text-red-700">
                {errorAddress}
              </p>
            )}
          </div>
          {!position.latitude && !position.longitude && (
            <span
              className="z-100 absolute bottom-[5px] right-[15px] top-[36px] animate-bounce md:top-[5px]"
              title="get your position"
            >
              <button
                className=""
                disabled={isLoadingAddress}
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(fetchAddress());
                }}
              >
                <img src={location} alt="" />
              </button>
            </span>
          )}
        </div>

        <div className="mb-12 flex items-center gap-5">
          <input
            className="h-6 w-6 accent-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
            type="checkbox"
            name="priority"
            checked={priority}
            onChange={() => setPriority(!priority)}
            id="priority"
          />
          <label htmlFor="priority" className="font-medium">
            Want to yo give your order priority?
          </label>
        </div>

        <div>
          <input type="hidden" name="cart" value={JSON.stringify(cart)} />
          <input
            type="hidden"
            name="position"
            value={
              position.longitude && position.latitude
                ? `${position.latitude}, ${position.longitude}}`
                : ''
            }
          />

          <Button type="primary" disabled={isSubmiting || isLoadingAddress}>
            {isSubmiting
              ? 'Placing order...'
              : `Order now from ${formatCurrency(Math.floor(totalPrice))}`}
          </Button>
        </div>
      </Form>
    </div>
  );
}

export async function action({ request }) {
  const formData = await request.formData();

  const data = Object.fromEntries(formData);

  const order = {
    ...data,
    cart: JSON.parse(data.cart),
    priority: data.priority === 'on',
  };

  const errors = {};

  if (!isValidPhone(order.phone))
    errors.phone =
      'Please give us your correct phone number. We might need it to contact you.';

  if (Object.keys(errors).length > 0) return errors;

  // if there was no error create the new Order and redirect
  const newOrder = await createOrder(order);

  store.dispatch(clearCart());

  return redirect(`/order/${newOrder.id}`);
}

export default CreateOrder;
