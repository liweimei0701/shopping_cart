import { useState } from "react";
import { useQuery } from "react-query";

import Item from "./Item/item";
import Cart from "./Cart/Cart";
import { Drawer, LinearProgress, Grid, Badge } from "@material-ui/core";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";

import { Wrapper, StyledButton } from "./App.styles";
export type CartItemType = {
  id: number;
  category: string;
  description: string;
  image: string;
  price: number;
  title: string;
  amount: number;
};

const getProducts = async (): Promise<CartItemType[]> => {
  return await (await fetch("https://fakestoreapi.com/products")).json();
};

const App = () => {
  const [open, setOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);

  const { data, isLoading, error } = useQuery<CartItemType[]>(
    "products",
    getProducts
  );

  const getCart = () => {
    const response = fetch(
      "https://blue-dew-7661.us-east1.akkaserverless.app/carts/c_03",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then(res => console.log(res.json())
    );
  };
  const handleAddToCart = (clickItem: CartItemType): void => {
    const payload = {
      product_id: clickItem.id,
      name: clickItem.title,
      quantity: 1,
    };
    const response = fetch(
      "https://blue-dew-7661.us-east1.akkaserverless.app/cart/c_03/items/add",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    ).then((res) => {
      console.log(res, payload);
    });
    setCartItems((prev) => {
      const isItemInCart = prev.find((item) => item.id === clickItem.id);

      if (isItemInCart) {
        return prev.map((item) =>
          item.id === clickItem.id ? { ...item, amount: item.amount + 1 } : item
        );
      }
      return [...prev, { ...clickItem, amount: 1 }];
    });
  };
  const getTotalItems = (cartItems: CartItemType[]) =>
    cartItems.reduce((ack: number, item) => ack + item.amount, 0);

  const handleRemoveFromCart = (id: number): void => {
    const response = fetch(
      `https://blue-dew-7661.us-east1.akkaserverless.app/cart/c_03/items/${id}/remove`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then((res) => console.log(`item ${id} has been removed successfully`));
    setCartItems((prev) => {
      return prev
        .map((item) => {
          if (item.id === id) return { ...item, amount: item.amount - 1 };
          return item;
        })
        .filter((item) => item.amount !== 0);
    });
  };

  if (isLoading) return <LinearProgress />;
  if (error) return <div>somthing went wrong...</div>;

  return (
    <Wrapper>
      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <Cart
          cartItems={cartItems}
          addToCart={handleAddToCart}
          removeFromCart={handleRemoveFromCart}
        />
      </Drawer>
      <StyledButton onClick={() => {getCart();setOpen(true)}}>
        <Badge badgeContent={getTotalItems(cartItems)} color="error">
          <AddShoppingCartIcon />
        </Badge>
      </StyledButton>
      <Grid container spacing={3}>
        {data?.map((item) => (
          <Grid item key={item.id} xs={12} sm={4}>
            <Item item={item} handleAddToCart={handleAddToCart} />
          </Grid>
        ))}
      </Grid>
    </Wrapper>
  );
};

export default App;
