import { useState } from 'react';
import { useQuery } from 'react-query';

import Item from './Item/item';
import Cart from './Cart/Cart';
import { Drawer, LinearProgress, Grid, Badge } from '@material-ui/core';
import AddShoppingCartIcon  from '@material-ui/icons/AddShoppingCart';

import { Wrapper, StyledButton } from './App.styles';
export type CartItemType = {
  id: number;
  category: string;
  description: string;
  image: string;
  price: number;
  title: string;
  amount: number;
}

const getProducts = async (): Promise<CartItemType[]> => {
   return await (await fetch('https://fakestoreapi.com/products')).json()
}

const App = () => {
  const [open, setOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);

  const { data, isLoading, error } = useQuery<CartItemType[]>('products', getProducts)

  const handleAddToCart = (clickItem: CartItemType): void => {
    // const isAlreadyIn = cartItems.find(item => item.id === clickItem.id)
    // console.log(isAlreadyIn);
    
    // let newCartItems:CartItemType[] = [];
    // if(isAlreadyIn) {
    //   newCartItems = cartItems.map(item => 
    //     item.id === clickItem.id 
    //     ? {...item, amount: item.amount + 1}
    //      : item
    //   )
    // } 
    // newCartItems = [...cartItems, {...clickItem, amount: 1}];
    // setCartItems(newCartItems);
    setCartItems(prev => {
      const isItemInCart = prev.find(item => item.id === clickItem.id);
      
      if(isItemInCart) {
        return prev.map(item => 
          item.id === clickItem.id 
            ? {...item, amount: item.amount + 1}
             : item
          )
      }
      return [...prev, {...clickItem, amount: 1}]
    });
  }
  const getTotalItems = (cartItems: CartItemType[]) => cartItems.reduce((ack: number, item) => ack + item.amount, 0);

  const handleRemoveFromCart = (id: number): void => {
    setCartItems(prev => {
    return prev.map(item => {
        if(item.id === id) return {...item, amount: item.amount - 1}
        return item 
      }).filter(item => item.amount !== 0)
    })
  };

  if(isLoading) return <LinearProgress/>
  if(error) return <div>somthing went wrong...</div>
  
  return (
    <Wrapper>
      <Drawer anchor='right' open={open} onClose={() => setOpen(false)}>
        <Cart cartItems={cartItems} addToCart={handleAddToCart} removeFromCart={handleRemoveFromCart}/>
      </Drawer>
      <StyledButton onClick={() => setOpen(true)}>
        <Badge badgeContent={getTotalItems(cartItems)} color='error'>
          <AddShoppingCartIcon/>
        </Badge>
      </StyledButton>
      <Grid container spacing={3}>
        {data?.map(item => (
          <Grid item key={item.id} xs={12} sm={4}>
            <Item item={item} handleAddToCart={handleAddToCart}/>
          </Grid>
        ))}
      </Grid>
    </Wrapper>
  );
}

export default App;
