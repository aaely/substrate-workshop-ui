import { atom, selector } from 'recoil'
import { recoilPersist } from 'recoil-persist'

const {persistAtom} = recoilPersist({
    key: 'recoil-persist',
    storage: localStorage
})

export const account = atom({
    key: 'account',
    default: '',
    effects_UNSTABLE: [persistAtom]
})

export const balance = atom({
    key: 'balance',
    default: 0,
    effects_UNSTABLE: [persistAtom]
})

export const user = atom({
    key: 'user',
    default: [],
    effects_UNSTABLE: [persistAtom]
})

export const posts = atom({
    key: 'posts',
    default: [],
    effects_UNSTABLE: [persistAtom]
})