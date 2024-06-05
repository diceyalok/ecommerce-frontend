import axios from "axios";
import { useEffect, useState } from "react";
import { VscError } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CartItemCard from "../components/cart-item";
import {
  addToCart,
  calculatePrice,
  discountApplied,
  removeCartItem,
} from "../redux/reducer/cartReducer";
import { RootState, server } from "../redux/store";
import { CartItem } from "../types/types";

const Cart = () => {
  const { cartItems, subtotal, tax, total, shippingCharges, discount } =
    useSelector((state: RootState) => state.cartReducer);
  const dispatch = useDispatch();

  const [couponCode, setCouponCode] = useState<string>("");
  const [isValidCouponCode, setIsValidCouponCode] = useState<boolean>(false);

  const incrementHandler = (cartItem: CartItem) => {
    if (cartItem.quantity >= cartItem.stock) return;

    dispatch(addToCart({ ...cartItem, quantity: cartItem.quantity + 1 }));
  };
  const decrementHandler = (cartItem: CartItem) => {
    if (cartItem.quantity <= 1) return;

    dispatch(addToCart({ ...cartItem, quantity: cartItem.quantity - 1 }));
  };
  const removeHandler = (productId: string) => {
    dispatch(removeCartItem(productId));
  };
  useEffect(() => {
    const { token: cancelToken, cancel } = axios.CancelToken.source();

    const timeOutID = setTimeout(() => {
      axios
        .get(`${server}/api/v1/payment/discount?coupon=${couponCode}`, {
          cancelToken,
        })
        .then((res) => {
          dispatch(discountApplied(res.data.discount));
          setIsValidCouponCode(true);
          dispatch(calculatePrice());
        })
        .catch(() => {
          dispatch(discountApplied(0));
          setIsValidCouponCode(false);
          dispatch(calculatePrice());
        });
    }, 1000);

    return () => {
      clearTimeout(timeOutID);
      cancel();
      setIsValidCouponCode(false);
    };
  }, [couponCode]);

  useEffect(() => {
    dispatch(calculatePrice());
  }, [cartItems]);

  return (
    <div className="cart">
      <main>
        {cartItems.length > 0 ? (
          cartItems.map((i, idx) => (
            <CartItemCard
              incrementHandler={incrementHandler}
              decrementHandler={decrementHandler}
              removeHandler={removeHandler}
              key={idx}
              cartItem={i}
            />
          ))
        ) : (
          <h1>No Items Added</h1>
        )}
      </main>
      <aside>
        <p>Subtotal: ₹{subtotal}</p>
        <p>Shipping Charges: ₹{shippingCharges}</p>
        <p>Tax: ₹{tax}</p>
        <p>
          Discount: <em className="red"> - ₹{discount}</em>
        </p>
        <p>
          <b>Total: ₹{total}</b>
        </p>

        <input
          type="text"
          placeholder="Coupon Code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
        />

        {couponCode &&
          (isValidCouponCode ? (
            <span className="green">
              ₹{discount} off using the <code>{couponCode}</code>
            </span>
          ) : (
            <span className="red">
              Invalid Coupon <VscError />
            </span>
          ))}

        {cartItems.length > 0 && <Link to="/shipping">Checkout</Link>}
      </aside>
    </div>
  );
};

export default Cart;











/*import { useEffect, useState } from "react";
import { VscError } from "react-icons/vsc";
import CartItem from "../components/cart-item";
import { Link } from "react-router-dom";


const cartItems = [
  {
    productId:"aswddfds",
    photo:"https://m.media-amazon.com/images/I/71WkDp--uqL._AC_SX342_.jpg",
    name:"mackbook",
    price:3000,
    quantity:4,
    stock:10,

  }
];
const subtotal = 4000;
const tax = Math.round(subtotal *0.18);
const shippingCharges = 200;
const discount =400;
const total = subtotal + tax + shippingCharges;

const Cart = () => {

const [couponCode,setCouponCode] = useState<string>("");
const [isValidCouponCode,setIsValidCouponCode] = useState<boolean>(false);
useEffect(() =>{
   const  timeOutID = setTimeout(() => {
    if (Math.random() > 0.5) setIsValidCouponCode(true);
      else setIsValidCouponCode(false);
}, 1000);

  return () => {
    clearTimeout(timeOutID);
    setIsValidCouponCode(false);

  }

}, [couponCode]);

  return ( 
   <div className="cart">
     
      <main>
       { cartItems.length > 0 ? cartItems.map((i,idx)=>(
        <CartItem key={idx} cartItem={i} />)
       ) :(<h1>no item added</h1>)}

        
        </main>   
      <aside>
        
        
           <p>Subtotal:₹{subtotal}</p> 
           <p>Shipping Charges:₹{shippingCharges}</p>
           <p>Tax:₹{tax}</p>   
           <p>
      Discount : <em className="red">  - ₹{discount}</em>
            
            </p> 
            <p>
              
              <b>Total :₹ {total}</b>
              </p>  
              <input 
               type="text"
               placeholder="Coupon Code"
                value={couponCode}
               onChange={(e) =>setCouponCode(e.target.value)}
       />
       {couponCode&&
       
       (isValidCouponCode?( <span className="green"> ₹{discount} off using the
       <code>{couponCode}</code>
        </span>
      ) :(
         <span className="red">
          Invalid Coupon <VscError/> </span>
      ) 
    )  
       }
       {
        cartItems.length > 0 && <Link to ="/shipping">Checkout</Link>
       }
        </aside>  


         </div>
  );      
  
};

export default Cart*/
