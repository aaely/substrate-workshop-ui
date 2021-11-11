import { atom, selectorFamily } from 'recoil'
import { recoilPersist } from 'recoil-persist'
import { pol_api_dev } from './recoil'

const {persistAtom} = recoilPersist({
    key: 'recoil-persist',
    storage: localStorage
})

export const aminoName = atom({
    key: 'aminoName',
    default: '',
    effects_UNSTABLE: [persistAtom]
})

export const peptideName = atom({
    key: 'peptideName',
    default: '',
    effects_UNSTABLE: [persistAtom]
})

export const bio = atom({
    key: 'bio',
    default: '',
    effects_UNSTABLE: [persistAtom]
})

export const website = atom({
    key: 'website',
    default: '',
    effects_UNSTABLE: [persistAtom]
})

export const handle = atom({
    key: 'handle',
    default: '',
    effects_UNSTABLE: [persistAtom]
})

export const peptideCost = atom({
    key: 'peptideCost',
    default: 0,
    effects_UNSTABLE: [persistAtom]
})

export const peptideInventory = atom({
    key: 'peptideInventory',
    default: 0,
    effects_UNSTABLE: [persistAtom]
})

export const chain = atom({
    key: 'chain',
    default: [],
    effects_UNSTABLE: [persistAtom]
})

export const aminoCost = atom({
    key: 'aminoCost',
    default: 0,
    effects_UNSTABLE: [persistAtom]
})

export const cannabinoidName = atom({
    key: 'cannabinoidName',
    default: '',
    effects_UNSTABLE: [persistAtom]
})

export const cannabinoidDesc = atom({
    key: 'cannabinoidDesc',
    default: '',
    effects_UNSTABLE: [persistAtom]
})

export const terpeneDesc = atom({
    key: 'terpeneDesc',
    default: '',
    effects_UNSTABLE: [persistAtom]
})

export const terpeneName = atom({
    key: 'terpeneName',
    default: '',
    effects_UNSTABLE: [persistAtom]
})

export const terpenes = atom({
    key: 'terpenes',
    default: [],
    effects_UNSTABLE: [persistAtom]
})

export const cannabinoids = atom({
    key: 'cannabinoids',
    default: [],
    effects_UNSTABLE: [persistAtom]
})

export const cannabisPrice = atom({
    key: 'cannabisPrice',
    default: 0,
    effects_UNSTABLE: [persistAtom]
})

export const cannabisName = atom({
    key: 'cannabisName',
    default: '',
    effects_UNSTABLE: [persistAtom]
})

export const cannabisCategory = atom({
    key: 'cannabisCategory',
    default: '',
    effects_UNSTABLE: [persistAtom]
})

export const cannabisInventory = atom({
    key: 'cannabisInventory',
    default: 0,
    effects_UNSTABLE: [persistAtom]
})

export const fName = atom({
    key: 'fName',
    default: '',
    effects_UNSTABLE: [persistAtom]
})

export const lName = atom({
    key: 'lName',
    default: '',
    effects_UNSTABLE: [persistAtom]
})

export const phone = atom({
    key: 'phone',
    default: '',
    effects_UNSTABLE: [persistAtom]
})

export const email = atom({
    key: 'email',
    default: '',
    effects_UNSTABLE: [persistAtom]
})

export const cannabisImageBuffer = atom({
    key: 'cannabisImageBuffer',
    default: '',
    effects_UNSTABLE: [persistAtom]
})

export const peptideImageBuffer = atom({
    key: 'peptideImageBuffer',
    default: '',
    effects_UNSTABLE: [persistAtom]
})

export const newPostFlag = atom({
    key: 'newPostFlag',
    default: false,
    effects_UNSTABLE: [persistAtom]
})

export const profileImageBuffer = atom({
    key: 'profileImageBuffer',
    default: '',
    effects_UNSTABLE: [persistAtom]
})

export const cannabisTab = atom({
    key: 'cannabisTab',
    default: 0,
    effects_UNSTABLE: [persistAtom]
})

export const cannabisSkipped = atom({
    key: 'cannabisSkipped',
    default: new Set<number>(),
    effects_UNSTABLE: [persistAtom]
})

export const formattedCannabinoids = atom({
    key: 'formattedCannabinoids',
    default: [],
    effects_UNSTABLE: [persistAtom]
})

export const formattedTerpenes = atom({
    key: 'formattedTerpenes',
    default: [],
    effects_UNSTABLE: [persistAtom]
})

export const postText = atom({
    key: 'postText',
    default: '',
    effects_UNSTABLE: [persistAtom]
})

export const commentText = atom({
    key: 'commentText',
    default: '',
    effects_UNSTABLE: [persistAtom]
})

export const hashtags = atom({
    key: 'hashtags',
    default: [],
    effects_UNSTABLE: [persistAtom]
})

export const postTab = atom({
    key: 'postTab',
    default: 0,
    effects_UNSTABLE: [persistAtom]
})

export const handleAvailability = selectorFamily({
    key: 'handleAvailability',
    get: param => async ({get}) => {
        try {
            const api = get(pol_api_dev)
            const bool = await api?.query['users']['userHandleAvailability'](param)
            return bool?.toHuman()
        } catch(error) {
            console.log(error)
        }  
    }
})
