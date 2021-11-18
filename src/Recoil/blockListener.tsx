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

export const postFeed = atom({
    key: 'postFeed',
    default: [],
    dangerouslyAllowMutability: true,
    effects_UNSTABLE: [persistAtom]
})

export const updateCommentsPostFeed = selector({
    key: 'updateCommentsPostFeed',
    get: () => {},
    set: ({get, set}, comment: any) => {
        let posts = [...get(postFeed)]
        let index = posts.findIndex((x: any) => x.id == comment.postId)
        posts[index].comments.push(comment)
        set(postFeed, [...posts])
    }
})