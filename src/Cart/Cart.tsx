import CartItem  from './CartItem/CartItem';
import { Wrapper } from './Cart.styles';
import { CartItemType } from '../App';

type Props = {
  cartItems: CartItemType[];
  addToCart: (clickItem: CartItemType) => void;
  removeFromCart: (id: number) => void;
}

const Cart: React.FC<Props> = ({ cartItems, addToCart, removeFromCart }) => {
  const getTotalPrice = (items: CartItemType[]): number => {
     return items.reduce((ack: number, item) => ack + item.amount * item.price, 0)
  }
  return (
    <Wrapper>
      <h2>Your shopping cart</h2>
      {cartItems.length === 0 && <p>No items in cart</p>}
      {cartItems.map(item => (
        <CartItem key={item.id} item={item} addToCart={addToCart} removeFromCart={removeFromCart}/>
      ))}
      <h2>Total: ${getTotalPrice(cartItems).toFixed(2)}</h2>
    </Wrapper>
  )
}

export default Cart;