import { ApiPromise, WsProvider } from '@polkadot/api';
import { atom, selector, selectorFamily } from 'recoil'
import { recoilPersist } from 'recoil-persist';
import types from '../types/types.json'
import jsonrpc from '@polkadot/types/interfaces/jsonrpc';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import keyring from '@polkadot/ui-keyring';
import { v5 } from 'uuid'

const { persistAtom } = recoilPersist({
    key: 'recoil-persist',
    storage: sessionStorage
})

export const update = atom({
    key: 'update',
    default: 0
})

export const namespace = atom({
    key: 'namespace',
    default: v5('5F99QonhtnPfj7HTbLM3qxokvemNxGgxCLsHcTHu8AYXgVoi', '1b671a64-40d5-479e-99b0-da01ee1f3391'),
    effects_UNSTABLE: [persistAtom]
})

export const accounts = atom({
    key: 'accounts',
    default: [],
    effects_UNSTABLE: [persistAtom]
})

export const pol_api = selector({
    key: 'pol_api',
    get: async ({get}) => {
        try {
            const prov = new WsProvider('wss://rpc.polkadot.io')
            const res = await ApiPromise.create({provider: prov, types, rpc: jsonrpc})
            return res
        } catch (error) {
            console.log(error)
        }
    }
})

export const pol_api_dev = selector({
    key: 'pol_api',
    get: async ({get}) => {
        try {
            const prov = new WsProvider('ws://127.0.0.1:9944')
            const res = await ApiPromise.create({provider: prov, types, rpc: jsonrpc})
            return res
        } catch (error) {
            console.log(error)
        }
    }
})

export const get_pol_accts = selector({
    key: 'get_pol_accts',
    get: async () => {
        try {
            await web3Enable('my_dream')
            let accts = await web3Accounts()
            keyring.loadAll({isDevelopment: true}, accts)
            const accounts = keyring.getPairs()
            return accounts
        } catch(error) {
            console.log(error)
            return 'no account found'
        }
    }
})

export const get_pol_acct = selector({
    key: 'get_pol_acct',
    get: async () => {
        try {
            await web3Enable('my_dream')
            let accts = await web3Accounts()
            return accts[0].address
        } catch(error) {
            console.log(error)
            return 'no account found'
        }
    }
})

export const get_cannabisProductByCount = selectorFamily({
    key: 'get_cannabisProductByCount',
    get: (param) => async ({get}) => {
        try {
            const _api = get(pol_api_dev)
            const res = await _api?.query['cannabis']['cannabisProductByCount'](param)
            return res?.toHuman()
        } catch(error) {
            console.log(error)
        }
    }
})

export const get_cannabisProductByCategory = selectorFamily({
    key: 'get_cannabisProductByCount',
    get: (param) => async ({get}) => {
        try {
            const _api = get(pol_api_dev)
            const res = await _api?.query['cannabis']['cannabisProductsByCategory'](param)
            return res?.toJSON()
        } catch(error) {
            console.log(error)
        }
    }
})

export const get_pol_cannabisCount = selector({
    key: 'get_pol_cannabisCount',
    get: async ({get}) => {
        try {
            get(update)
            const _api = get(pol_api_dev)
            const res = await _api?.query['cannabis']['cannabisCount']()
            return res?.toHuman()
        } catch(error) {
            console.log(error)
        }
    }
})

export const get_all_cannabisProducts = selector({
    key: 'get_all_cannabisProducts',
    get: async ({get}) => {
        try {
            const count: any = get(get_pol_cannabisCount)
            let products = []
            for(let i = 0; i < count; i++) {
                const product = get(get_cannabisProductByCount(i))
                products.push(product)
            }
            return products
        } catch(error) {
            console.log(error)
        }
    }
})

export const get_all_cannabinoids = selector({
    key: 'get_all_cannabinoids',
    get: async ({get}) => {
        try {
            const count: any = get(get_cannabinoidCount)
            let cannabinoids = []
            for(let i = 0; i < count; i++) {
                const cannabinoid = get(get_cannabinoid_by_count(i))
                cannabinoids.push(cannabinoid)
            }
            return cannabinoids
        } catch(error) {
            console.log(error)
        }
    }
})

export const get_terpene_by_count = selectorFamily({
    key: 'get_terpene_by_count',
    get: param => async ({get}) => {
        try {
            const _api = get(pol_api_dev)
            const res = await _api?.query['cannabis']['terpeneByCount'](param)
            return res?.toHuman()
        } catch(error) {
            console.log(error)
        }
    }
})

export const get_cannabinoid_by_count = selectorFamily({
    key: 'get_cannabinoid_by_count',
    get: param => async ({get}) => {
        try {
            const _api = get(pol_api_dev)
            const res = await _api?.query['cannabis']['cannabinoidByCount'](param)
            return res?.toHuman()
        } catch(error) {
            console.log(error)
        }
    }
})

export const get_all_terpenes = selector({
    key: 'get_all_terpenes',
    get: async ({get}) => {
        try {
            const count: any = get(get_terpeneCount)
            let terpenes = []
            for(let i = 0; i < count; i++) {
                const terpene = get(get_terpene_by_count(i))
                terpenes.push(terpene)
            }
            return terpenes
        } catch(error) {
            console.log(error)
        }
    }
})

export const get_user_posts = selectorFamily({
    key: 'get_user_posts',
    get: param => async ({get}) => {
      try {
        get(update)
        const _api = get(pol_api_dev)
        console.log(param)
        const posts = await _api?.query['socialMedia']['posts'](param)
        return posts?.toJSON()
        } catch(error) {
            console.log(error)
        }
    }
})

export const get_post_by_count = selectorFamily({
    key: 'get_post_by_count',
    get: param => async ({get}) => {
      try {
        get(update)
        const _api = get(pol_api_dev)
        console.log(param)
        const posts = await _api?.query['socialMedia']['postByCount'](param)
        return posts?.toJSON()
        } catch(error) {
            console.log(error)
        }
    }
})

export const get_comment_by_count = selectorFamily({
    key: 'get_post_by_count',
    get: param => async ({get}) => {
      try {
        get(update)
        const _api = get(pol_api_dev)
        console.log(_api?.query['socialMedia'])
        const comment = await _api?.query['socialMedia']['commentsById'](param)
        return comment?.toHuman()
        } catch(error) {
            console.log(error)
        }
    }
})

export const get_post_count = selector({
    key: 'get_post_count',
    get: async ({get}) => {
      try {
        get(update)
        const _api = get(pol_api_dev)
        const postCount = await _api?.query['socialMedia']['postCount']()
        return postCount?.toJSON()
        } catch(error) {
            console.log(error)
        }
    }
})

export const get_terpeneCount = selector({
    key: 'get_terpeneCount',
    get: async ({get}) => {
        try {
            const _api = get(pol_api_dev)
            const res = await _api?.query['cannabis']['terpeneCount']()
            return res
        } catch(error) {
            console.log(error)
        }
    }
})

export const get_cannabinoidCount = selector({
    key: 'get_cannabinoidCount',
    get: async ({get}) => {
        try {
            const _api = get(pol_api_dev)
            const res = await _api?.query['cannabis']['cannabinoidCount']()
            return res
        } catch(error) {
            console.log(error)
        }
    }
})

export const get_owner = selector({
    key: 'get_owner',
    get: async ({get}) => {
        try{
            const _api = get(pol_api_dev)
            const res = await _api?.query['users']['owner']();
            return res?.toHuman()
        } catch(error) {
            console.log(error)
        }
    }
})

export const get_cannabis_product = selectorFamily({
    key: 'get_cannabis_product',
    get: param => async ({get}) => {
        try {
            const _api = get(pol_api_dev)
            const res = await _api?.query['cannabis']['cannabisProducts'](param)
            return res?.toJSON()
        } catch(error) {
            console.log(error)
        }
    }
})

export const get_orders = selector({
    key: 'get_orders',
    get: async ({get}) => {
        try {
            get(update)
            const _api = get(pol_api_dev)
            const acct = get(get_pol_acct)
            const res = await _api?.query['orders']['ordersByUser'](acct)
            return res?.toHuman()
        } catch(error) {
            console.log(error)
        }
    }
})

export const get_pol_aminoByCount = selectorFamily({
    key: 'get_pol_aminoByCount',
    get: (param) => async ({get}) => {
        try {
            const _api = get(pol_api_dev)
            const res = await _api?.query['peptides']['aminoAcidByCount'](param)
            return res?.toHuman()
        } catch(error) {
            console.log(error)
        }
    }
})

export const get_all_aminos = selector({
    key: 'get_all_aminos',
    get: async ({get}) => {
        try {
            get(update)
            const count: any = get(get_pol_aminoAcidCount)
            let aminos = []
            for(let i = 0; i < count; i++) {
                aminos.push(get(get_pol_aminoByCount(i)))
            }
            return aminos
        } catch(error) {
            console.log(error)
        }
    }
})

export const get_pol_peptideByCount = selectorFamily({
    key: 'get_pol_peptideByCount',
    get: (param) => async ({get}) => {
        try {
            get(update)
            const _api = get(pol_api_dev)
            const res = await _api?.query['peptides']['peptideByCount'](param)
            return res?.toHuman()
        } catch(error) {
            console.log(error)
        }
    }
})

export const get_pol_peptideById = selectorFamily({
    key: 'get_pol_peptideById',
    get: (param) => async ({get}) => {
        try {
            const _api = get(pol_api_dev)
            const res = await _api?.query['peptides']['peptides'](param)
            return res?.toHuman()
        } catch(error) {
            console.log(error)
        }
    }
})

export const get_all_peptides = selector({
    key: 'get_all_peptides',
    get: async ({get}) => {
        try {
            get(update)
            const count: any = get(get_pol_peptideCount)
            let peptides = []
            for(let i = 0; i < count; i++) {
                const p = get(get_pol_peptideByCount(i))
                peptides.push(p)
            }
            return peptides
        } catch(error) {
            console.log(error)
        }
    }
})

export const get_pol_peptideCount = selector({
    key: 'get_pol_peptideCount',
    get: async ({get}) => {
        try {
            get(update)
            const _api = get(pol_api_dev)
            const res = await _api?.query['peptides']['peptideCount']()
            return res?.toJSON()
        } catch(error) {
            console.log(error)
        }
    }
})

export const get_pol_aminoAcidCount = selector({
    key: 'get_pol_aminoAcidCount',
    get: async ({get}) => {
        try {
            get(update)
            const _api = get(pol_api_dev)
            const res = await _api?.query['peptides']['aminoAcidCount']()
            return res?.toHuman()
        } catch(error) {
            console.log(error)
        }
    }
})

export const is_user_registered = selectorFamily({
    key: 'is_user_registered',
    get: param => async ({get}) => {
        try {
            get(update)
            const api = get(pol_api_dev)
            const res: any = await api?.query['users']['userAccess'](param)
            return res.toHuman()
        } catch(error) {
            console.log(error)
        }
    }
})

export const get_user_profile_image = selectorFamily({
    key: 'get_user_profile_image',
    get: param => async ({get}) => {
        try {
            get(update)
            const api = get(pol_api_dev)
            const res: any = await api?.query['users']['profileImageByAccount'](param)
            return res.toHuman()
        } catch(error) {
            console.log(error)
        }
    }
})

export const has_liked_post = selectorFamily({
    key: 'has_liked_post',
    get: (param: any) => async ({get}) => {
        try {
            get(update)
            const api = get(pol_api_dev)
            const res: any = await api?.query['socialMedia']['hasLikedPost'](param.id, param.address)
            return res.toHuman()
        } catch(error) {
            console.log(error)
        }
    }
})

export const has_liked_comment = selectorFamily({
    key: 'has_liked_comment',
    get: (param: any) => async ({get}) => {
        try {
            get(update)
            const api = get(pol_api_dev)
            const res: any = await api?.query['socialMedia']['hasLikedComment'](param.id, param.author)
            return res.toHuman()
        } catch(error) {
            console.log(error)
        }
    }
})

export const get_comments_for_post = selectorFamily({
    key: 'get_comments_for_post',
    get: (param: any) => async ({get}: any) => {
        try {
            get(update)
            const api = get(pol_api_dev)
            const res: any = await api?.query['socialMedia']['commentsByPost'](param.id, param.address)
            return res.toHuman()
        } catch(error) {
            console.log(error)
        }
    }
})

export const commentsLoading = atom({
    key: 'commentsLoading',
    default: true
})