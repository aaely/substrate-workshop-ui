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

export const currentFeed = atom({
    key: 'currentFeed',
    default: 'liveFeed',
    effects_UNSTABLE: [persistAtom]
})

export const postFeed = atom({
    key: 'postFeed',
    default: [],
    dangerouslyAllowMutability: true,
    effects_UNSTABLE: [persistAtom]
})

export const myPosts = atom({
    key: 'myPosts',
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
        if(index === -1) return
        posts[index].totalComments += 1
        set(postFeed, [...posts])
        return
    },
    dangerouslyAllowMutability: true,
    cachePolicy_UNSTABLE: {
        // Only store the most recent set of dependencies and their values
        eviction: 'most-recent',
    },
})

export const updatePostLiked = selector({
    key: 'updatePostLiked',
    get: () => {},
    set: ({get, set}, postId: any) => {
        let currentPosts = [...get(postFeed)]
        let posts = [...get(myPosts)]
        let index1 = currentPosts.findIndex((x: any) => x.id == postId)
        let index2 = posts.findIndex((x: any) => x.id == postId)
        if(index1 === -1) return
        if(index2 === -1) return
        currentPosts[index1].likes = parseInt(currentPosts[index1].likes) + 1
        posts[index2].likes = parseInt(posts[index2].likes) + 1
        set(postFeed, [...currentPosts])
        set(myPosts, [...posts])
    },
    cachePolicy_UNSTABLE: {
        // Only store the most recent set of dependencies and their values
        eviction: 'most-recent',
    },
})

export const updatePostUnliked = selector({
    key: 'updatePostUnliked',
    get: () => {},
    set: ({get, set}, postId: any) => {
        let currentPosts = [...get(postFeed)]
        let posts = [...get(myPosts)]
        let index1 = currentPosts.findIndex((x: any) => x.id == postId)
        let index2 = posts.findIndex((x: any) => x.id == postId)
        if(index1 === -1) return
        if(index2 === -1) return
        currentPosts[index1].likes = parseInt(currentPosts[index1].likes) - 1
        posts[index2].likes = parseInt(posts[index2].likes) - 1
        set(postFeed, [...currentPosts])
        set(myPosts, [...posts])
    },
    cachePolicy_UNSTABLE: {
        // Only store the most recent set of dependencies and their values
        eviction: 'most-recent',
    },
})

export const updateCommentLiked = selector({
    key: 'updateCommentLiked',
    get: () => {},
    set: ({get, set}, payload: any) => {
        let posts = [...get(postFeed)]
        let postIndex = posts.findIndex((x: any) => x.id == payload.postId)
        if(postIndex === -1) return
        let commentIndex = posts[postIndex].comments?.findIndex((x: any) => x.commentId == payload.commentId)
        if(commentIndex === -1) return
        posts[postIndex].comments[commentIndex].likes = parseInt(posts[postIndex].comments[commentIndex].likes) + 1
        set(postFeed, [...posts])
    },
    dangerouslyAllowMutability: true,
    cachePolicy_UNSTABLE: {
        // Only store the most recent set of dependencies and their values
        eviction: 'most-recent',
    },
})

export const updateCommentUnliked = selector({
    key: 'updateCommentUnliked',
    get: () => {},
    set: ({get, set}, payload: any) => {
        let posts = [...get(postFeed)]
        let postIndex = posts.findIndex((x: any) => x.id == payload.postId)
        if(postIndex === -1) return
        let commentIndex = posts[postIndex].comments?.findIndex((x: any) => x.commentId == payload.commentId)
        if(commentIndex === -1) return
        posts[postIndex].comments[commentIndex].likes = parseInt(posts[postIndex].comments[commentIndex].likes) - 1
        set(postFeed, [...posts])
    },
    dangerouslyAllowMutability: true,
    cachePolicy_UNSTABLE: {
        // Only store the most recent set of dependencies and their values
        eviction: 'most-recent',
    },
})

export const commentLikedId = atom({
    key: 'commentLikedId',
    default: 0,
})

export const BTCPrice = atom({
    key: 'BTCPrice',
    default: 0,
    effects_UNSTABLE: [persistAtom]
})

export const ETHPrice = atom({
    key: 'BTCPrice',
    default: 0,
    effects_UNSTABLE: [persistAtom]
})

export const DOTPrice = atom({
    key: 'BTCPrice',
    default: 0,
    effects_UNSTABLE: [persistAtom]
})

export const ATOMPrice = atom({
    key: 'BTCPrice',
    default: 0,
    effects_UNSTABLE: [persistAtom]
})