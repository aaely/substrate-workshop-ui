import { Avatar, Box } from '@mui/material'
import { useRecoilValue } from 'recoil'
import './app.css'
import { 
    pol_api_dev, 
    get_user_profile_image,
    has_liked_comment,
    get_pol_acct,
} from '../Recoil/recoil'
import {AiOutlineLike} from 'react-icons/ai'
import { web3FromSource } from '@polkadot/extension-dapp'
import { useEffect, useState } from 'react'
import { useSpring, animated } from 'react-spring'

export default function CommentDetails(props: any) {
    const api = useRecoilValue(pol_api_dev)
    const acct = useRecoilValue(get_pol_acct)
    const param = {
        id: props.comment.commentId,
        author: acct,
    }
    const userInfoComment = useRecoilValue(get_user_profile_image(props.comment.author))
    const hasLikedComment = useRecoilValue(has_liked_comment(param))
    const [loading, setLoading] = useState(true)
    const [liked, setLiked] = useState(true)
    

    useEffect(() => {
        if(loading){
            setLiked(hasLikedComment)
            setLoading(false)
        }
    })

    async function likeComment(commentId: number, commentAuthor: any, postId: number, author: any) {
        try {
            const injected = await web3FromSource('polkadot-js')
            const unsub: any = await api?.tx['socialMedia']['likeComment'](commentId, commentAuthor, postId, author).signAndSend(acct, {signer: injected.signer}, (result: any) => {
                console.log(`Current status is ${result.status}`);
            
                if (result.status.isInBlock) {
                  console.log(`Transaction included at blockHash ${result.status.asInBlock}`);
                  setLiked(!liked)
                  unsub();
                } else if (result.status.isFinalized) {
                  console.log(`Transaction finalized at blockHash ${result.status.asFinalized}`);
                }
              })
        } catch(error) {
            console.log(error)
        }
    }

    async function unlikeComment(commentId: number, commentAuthor: any, postId: number, author: any) {
        try {
            const injected = await web3FromSource('polkadot-js')
            const unsub: any = await api?.tx['socialMedia']['unlikeComment'](commentId, commentAuthor, postId, author).signAndSend(acct, {signer: injected.signer}, (result: any) => {
                console.log(`Current status is ${result.status}`);
            
                if (result.status.isInBlock) {
                  console.log(`Transaction included at blockHash ${result.status.asInBlock}`);
                  setLiked(!liked)
                  unsub();
                } else if (result.status.isFinalized) {
                  console.log(`Transaction finalized at blockHash ${result.status.asFinalized}`);
                }
              })
        } catch(error) {
            console.log(error)
        }
    }

    const renderLike = () => {
        return(
                <div onClick={() => likeComment(props.comment.commentId, props.comment.author, props.postId, props.postAuthor)}>
                    <AiOutlineLike/> {props.comment.likes}
                </div>
        )
    }

    const renderUnlike = () => {
        return(
                <div onClick={() => unlikeComment(props.comment.commentId, props.comment.author, props.postId, props.postAuthor)}>
                    Unlike {props.comment.likes}
                </div>
        )
    }

    return(
            <Box className='commentsHeader'> 
                <Avatar src={`https://ipfs.infura.io/ipfs/${userInfoComment[1]}`} />
                <a>@{userInfoComment[0]}</a>
                <p>{props.comment.date}</p>
                <div className='commentsBody'>{props.comment.comment}</div>
                <div className='commentsFooter'>
                    <div className='commentsFooterItem'>
                        {liked ? renderUnlike() : renderLike()}
                    </div>
                </div>
            </Box>
    )
}