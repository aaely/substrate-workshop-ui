import { useEffect } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { pol_api_dev } from '../Recoil/recoil'
import { 
    blockNumber as b, 
    finalizedBlockNumber as f, 
    eventFeed as e,
    postFeed,
    updateCommentsPostFeed,
    updatePostUnliked,
    updatePostLiked,
    updateCommentLiked,
    updateCommentUnliked,
} from '../Recoil/blockListener'

const FILTERED_EVENTS = [
    'system:ExtrinsicSuccess::',
  ];

const TRACKED_EVENTS = [
    'socialMedia:NewPost::',
    'socialMedia:NewComment::',
    'socialMedia:PostLiked::',
    'socialMedia:PostUnliked::',
    'socialMedia:CommentLiked::',
    'socialMedia:CommentUnliked::',
]

const useChainListener = () => {

    const api = useRecoilValue(pol_api_dev)
    const setBlockNumber = useSetRecoilState(b);
    const setFinalizedBlockNumber = useSetRecoilState(f);
    const setFeed: any = useSetRecoilState(e)
    const feed: any = useRecoilValue(e)
    const bn = useRecoilValue(b)
    const [posts, setPosts] = useRecoilState(postFeed)
    const updateComments = useSetRecoilState(updateCommentsPostFeed)
    const likedPost = useSetRecoilState(updatePostLiked)
    const unlikedPost = useSetRecoilState(updatePostUnliked)
    const likedComment = useSetRecoilState(updateCommentLiked)
    const unlikedComment = useSetRecoilState(updateCommentUnliked)

    useEffect(() => {
        (async () => {
            await api?.rpc.chain.subscribeNewHeads((header: any) => {
                setBlockNumber(header.number.toHuman())
            })
            await api?.rpc.chain.subscribeFinalizedHeads((header: any) => {
                setFinalizedBlockNumber(header.number.toHuman())
            })
            if(feed?.length > 1000) {
                setFeed([])
                console.log('event feed cleared')
            }
            await api?.query.system.events(events => {
                events.forEach(record => {
                    const { event }: any = record
                    const types = event.typeDef
                    const eventName = `${event.section}:${event.method}::`
                    if (FILTERED_EVENTS.includes(eventName)) return
                    switch (eventName) {
                        case TRACKED_EVENTS[0]: {
                            let newPost = event['data'][0].toHuman()
                            const index = posts.findIndex((x: any) => x.id === newPost.id)
                            if(index < 0){
                                setPosts([...posts, newPost])
                                return
                            }
                            if(index >= 0) {
                                return
                            }
                            break;
                        }
                        case TRACKED_EVENTS[1]: {
                            let newComment = event['data'][0].toHuman()
                            updateComments(newComment)
                            break;
                        }
                        case TRACKED_EVENTS[2]: {
                            const postLiked = event['data'][0].toHuman()
                            likedPost(postLiked)
                            break;
                        }
                        case TRACKED_EVENTS[3]: {
                            const postUnliked = event['data'][0].toHuman()
                            unlikedPost(postUnliked)
                            break;
                        }
                        case TRACKED_EVENTS[4]: {
                            const payload = {
                                postId: event['data'][0].toHuman(),
                                commentId: event['data'][1].toHuman(),
                            }
                            likedComment(payload)
                            break;
                        }
                        case TRACKED_EVENTS[5]: {
                            const payload = {
                                postId: event['data'][0].toHuman(),
                                commentId: event['data'][1].toHuman(),
                            }
                            unlikedComment(payload)
                            break;
                        }
                        default: break;
                    }
                    const params = event.data.map((data:any, index: number) => `${types[index].type}: ${data.toHuman()}`)
                    setFeed((ev: any) => [{
                        icon: 'bell',
                        summary: `${eventName}-${ev.length}`,
                        extraText: event.meta.docs.join(', ').toString(),
                        content: params.join(', ')
                    }, ...ev])
                })
            })
        })()
    }, [bn])
}

export default useChainListener