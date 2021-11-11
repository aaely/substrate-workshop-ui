import { useRecoilValue, useSetRecoilState, useRecoilState } from "recoil"
import { get_all_cannabisProducts, get_all_peptides, get_cannabisProductByCategory } from "../Recoil/recoil"
import { cart as c } from "../Recoil/cart"
import MuiCard from '../Components/MuiCard'
import CannabisMuiCard from "../Components/CannabisMuiCard"
import Box from '@mui/material/Box';

export default function Products() {

    const peptides = useRecoilValue(get_all_peptides)
    const [cart, setCart] = useRecoilState(c)
    const cannabis = useRecoilValue(get_all_cannabisProducts)
    const flower = useRecoilValue(get_cannabisProductByCategory('Flower'))
    console.log(flower)
    const addToCart = (item: any) => {
        console.log(item)
        const index = cart.findIndex((x: any) => x.id === item['id'])
        if(index < 0 && cart.length === 0) {
            const newItem = [{id: item.id, name: item.name, price: item.price, quantity: 1}]
            setCart(newItem)
            return
        }
        if(index < 0 && cart.length > 0) {
            const newItem = {id: item.id, name: item.name, price: item.price, quantity: 1}
            setCart([...cart, newItem])
            return
        }
        if(index >= 0) {
            let newCart = [...cart]
            newCart[index].quantity = newCart[index].quantity + 1
            setCart(newCart)
            return
        }
        return
    }

    return(
        <Box className='productsContainer'>
            <h1 style={{width: '100vw', textAlign: 'center'}}>Available Products</h1>
                <h3 style={{width: '100vw', textAlign: 'center'}}>Peptides</h3>
                {peptides?.map((peptide: any, i: number) => {
                return(
                    <MuiCard
                    key={i}
                    peptide={peptide}
                    addProduct={addToCart}
                    />
                    )
                })}
                <h3 style={{width: '100vw', textAlign: 'center'}}>Cannabis</h3>
                {cannabis?.map((cann: any, i: number) => {
                return(
                    <CannabisMuiCard
                    key={i}
                    cannabis={cann}
                    addProduct={addToCart}
                    />
                    )
                })}
        </Box>
    )
}