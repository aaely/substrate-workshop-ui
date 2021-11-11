import { atom, selector } from 'recoil'
import { recoilPersist } from 'recoil-persist'

const {persistAtom} = recoilPersist({
    key: 'recoil-persist',
    storage: localStorage
})

export const cart = atom({
    key: 'cart',
    default: [],
    dangerouslyAllowMutability: true,
    effects_UNSTABLE: [persistAtom]
})

export const total = selector({
    key: 'total',
    get: ({get}) => {
        const c: any = get(cart)
        let total = 0
        for(let i = 0; i < c.length; i++) {
            total = total + c[i].price*c[i].quantity
            console.log(total, c[i])
        }
        return total / 100
    }
})

export const peptide_products = selector({
    key: 'peptide_products',
    get: async ({get}) => {
        try {
            const c = get(cart)
            let items = []
            for(let i = 0; i < c.length; i++) {
                let item = [c[i].id, c[i].quantity]
                items.push(item)
            }
            return items
        } catch(error) {
            console.log(error)
        }
    }
})

export const products = selector({
    key: 'products',
    get: async ({get}) => {
        try {
            const c = get(cart)
            let items = []
            for(let i = 0; i < c.length; i++) {
                let item = [c[i].name, c[i].price, c[i].quantity]
                items.push(item)
            }
            return items
        } catch(error) {
            console.log(error)
        }
    }
})