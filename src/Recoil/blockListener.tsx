import { atom, selector } from 'recoil'
import { recoilPersist } from 'recoil-persist'

const {persistAtom} = recoilPersist({
    key: 'recoil-persist',
    storage: localStorage
})

export const blockNumber = atom({
    key: 'blockNumber',
    default: 0,
    effects_UNSTABLE: [persistAtom]
})

export const finalizedBlockNumber = atom({
    key: 'finalizedBlockNumber',
    default: 0,
    effects_UNSTABLE: [persistAtom]
})

export const eventFeed = atom({
    key: 'eventFeed',
    default: []
})