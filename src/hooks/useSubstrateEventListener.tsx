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
    BTCPrice,
    ATOMPrice,
    DOTPrice,
    ETHPrice,
    commentLikedId,
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
    'ocw:BTCPrice::',
    'ocw:ETHPrice::',
    'ocw:DOTPrice::',
    'ocw:ATOMPrice::',
]

export default function useSubstrateEventListener() {
    const api = useRecoilValue(pol_api_dev)
    const setFeed: any = useSetRecoilState(e)
    const feed: any = useRecoilValue(e)
    const [posts, setPosts] = useRecoilState(postFeed)
    const updateComments = useSetRecoilState(updateCommentsPostFeed)
    const likedPost = useSetRecoilState(updatePostLiked)
    const unlikedPost = useSetRecoilState(updatePostUnliked)
    const setId = useSetRecoilState(commentLikedId)
    const setBtc = useSetRecoilState(BTCPrice)
    const setEth = useSetRecoilState(ETHPrice)
    const setDot = useSetRecoilState(DOTPrice)
    const setAtom = useSetRecoilState(ATOMPrice)
    useEffect(() => {
        let unsub: any = null
        if(feed.length > 1000) {
            setFeed([])
        }
        const allEvents = async () => {
            unsub = await api?.query.system.events((events: any) => {
                    events.forEach((record: any) => {
                        const { event }: any = record
                        const types = event.typeDef
                        const eventName = `${event.section}:${event.method}::`
                        console.log(eventName)
                        if (FILTERED_EVENTS.includes(eventName)) return
                        switch (eventName) {
                            case TRACKED_EVENTS[0]: {
                                let newPost = event['data'][0].toHuman()
                                setPosts([...posts, newPost])
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
                                setId(payload.commentId)
                                break;
                            }
                            case TRACKED_EVENTS[5]: {
                                const payload = {
                                    postId: event['data'][0].toHuman(),
                                    commentId: event['data'][1].toHuman(),
                                }
                                setId(payload.commentId)
                                break;
                            }
                            case TRACKED_EVENTS[6]: {
                                setBtc(event['data'][0].toHuman())
                                break;
                            }
                            case TRACKED_EVENTS[7]: {
                                setEth(event['data'][0].toHuman())
                                break;
                            }
                            case TRACKED_EVENTS[8]: {
                                setDot(event['data'][0].toHuman())
                                break;
                            }
                            case TRACKED_EVENTS[9]: {
                                setAtom(event['data'][0].toHuman())
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
        }
        allEvents()
        return () => unsub && unsub()
    },[api?.query.system])
}