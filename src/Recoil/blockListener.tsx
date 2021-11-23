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

export const updateCommentsPostFeed = selector({
    key: 'updateCommentsPostFeed',
    get: () => {},
    set: ({get, set}, comment: any) => {
        let posts = [...get(postFeed)]
        let index = posts.findIndex((x: any) => x.id == comment.postId)
        if(index === -1) return
        let commentIndex = posts[index].comments?.findIndex((x: any) => x.commentId == comment.commentId)
        if(commentIndex === -1) {
            posts[index].comments.push(comment)
            set(postFeed, [...posts])
        }
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
        let posts = [...get(postFeed)]
        let index = posts.findIndex((x: any) => x.id == postId)
        if(index === -1) return
        posts[index].likes = parseInt(posts[index].likes) + 1
        set(postFeed, [...posts])
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
        let posts = [...get(postFeed)]
        let index = posts.findIndex((x: any) => x.id == postId)
        if(index === -1) return
        posts[index].likes = parseInt(posts[index].likes) - 1
        set(postFeed, [...posts])
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