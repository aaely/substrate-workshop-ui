import { useEffect } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { pol_api_dev, get_pol_acct } from '../Recoil/recoil'
import { 
    blockNumber as b, 
    finalizedBlockNumber as f, 
    eventFeed as e,
    postFeed,
    updateCommentsPostFeed,
} from '../Recoil/blockListener'

const FILTERED_EVENTS = [
    'system:ExtrinsicSuccess:: (phase={"applyExtrinsic":0})',
    'system:ExtrinsicSuccess:: (phase={"applyExtrinsic":1})',
  ];

const TRACKED_EVENTS = [
    'socialMedia:NewPost:: (phase={"applyExtrinsic":1})',
    'socialMedia:NewComment:: (phase={"applyExtrinsic":1})',
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
    console.log(posts)

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
            }
            await api?.query.system.events(events => {
                events.forEach(record => {
                    const { event, phase }: any = record
                    const types = event.typeDef
                    const eventName = `${event.section}:${event.method}:: (phase=${phase.toString()})`
                    if (FILTERED_EVENTS.includes(eventName)) return
                    console.log(eventName, TRACKED_EVENTS[0])
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
                            let index = posts.findIndex((x: any) => x.id == newComment.postId)
                            let commentIndex = posts[index].comments?.findIndex((x: any) => x.commentId == newComment.commentId)
                            if(commentIndex < 0) {
                                updateComments(newComment)
                            }
                            break;
                        }
                    }
                    const params = event.data.map((data:any, index: number) => `${types[index].type}: ${data.toHuman()}`)
                    console.log()
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