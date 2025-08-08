import { db } from "../data/db";
import type { CartItem, Guitar } from "../types";

export type CartActions = 
    { type: 'add-to-cart', payload: {item: Guitar}} |
    { type: 'remove-from-cart', payload: {id: Guitar['id']}} |
    { type: 'decrease-quantity', payload: {id: Guitar['id']}} |
    { type: 'increase-quantity', payload: {id: Guitar['id']}} |
    { type: 'clean-cart'} 

export type CartState = {
    data: Guitar[],
    cart: CartItem[]
}

const initialCart = (): CartItem[] => {
    const localStorageCart = localStorage.getItem("carrito");
    return localStorageCart ? JSON.parse(localStorageCart) : [];
}

export const initialState: CartState = {
    data: db,
    cart: initialCart()
}

const MAX_ITEMS = 5;
const MIN_ITEMS = 1;

export const cartReducer = (
    state: CartState = initialState,
    action: CartActions
) => {
    if(action.type === 'add-to-cart'){
        const itemExist = state.cart.find((guitar) => guitar.id === action.payload.item.id);

        let updatedCart: CartItem[] = [];
        if(itemExist) {
            updatedCart = state.cart.map(item => {
                if(item.id === action.payload.item.id){
                    if(item.quantity < MAX_ITEMS){
                        return {...item, quantity: item.quantity + 1}
                    }else{
                        return item;
                    }
                }else{
                    return item;
                }
            })
        }else{
            const newItem : CartItem = { ...action.payload.item, quantity: 1}    
            updatedCart = [...state.cart, newItem];
        }

        return {
            ...state,
            cart: updatedCart
        }
    }

    if(action.type === 'remove-from-cart'){
        return {
            ...state,
            cart: state.cart.filter(item => item.id !== action.payload.id)
        }
    }

    if (action.type === 'decrease-quantity') {
        const cart: CartItem[] = [];
        for (let i = 0; i < state.cart.length; i++) {
            const item = state.cart[i];

            if (item.id === action.payload.id && item.quantity > MIN_ITEMS) {
                cart.push({ ...item, quantity: item.quantity - 1 }); // ✅ sin mutar
                continue;
            } else if (item.id === action.payload.id && item.quantity <= MIN_ITEMS) {
                continue; // no se agrega
            }

            cart.push(item);
        }

        return {
            ...state,
            cart
        };
    }


    if(action.type === 'increase-quantity'){
        const cart = state.cart.map(item => {
            if(item.id === action.payload.id && item.quantity < MAX_ITEMS) {
                return {
                    ...item,
                    quantity: item.quantity + 1
                }
            }

            return item;
        })

        return {
            ...state,
            cart
        }
    }
    
    if(action.type === 'clean-cart'){
        return {
            ...state,
            cart: []
        }
    }

    return state 
}