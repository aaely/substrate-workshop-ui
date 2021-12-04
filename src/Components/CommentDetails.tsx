import { Avatar, Box } from '@mui/material'
import { useRecoilValue } from 'recoil'
import './app.css'
import { 
    pol_api_dev, 
    get_user_profile_image,
} from '../Recoil/recoil'
import {
    user as u
} from '../Recoil/balanceListener'
import {AiOutlineLike} from 'react-icons/ai'
import { web3FromSource } from '@polkadot/extension-dapp'
import { useEffect, useState } from 'react'
import { useSpring, animated } from 'react-spring'
import checkHasLikedComment from '../utils/checkHasLikedComment'
import {SiParitysubstrate} from 'react-icons/si'
import { commentLikedId } from '../Recoil/blockListener'

export default function CommentDetails(props: any) {
    const api = useRecoilValue(pol_api_dev)
    const user = useRecoilValue(u)
    const userInfoComment = useRecoilValue(get_user_profile_image(props.comment.author))
    const [liked, setLiked] = useState(true)
    const [edit, setEdit] = useState(false)
    const id = useRecoilValue(commentLikedId)

    useEffect(() => {
        (async () => {
            if(id === props.comment.commentId) {
                setLiked(await checkHasLikedComment(user.address, props.comment.commentId, api))
            }
        })()
    },[props.comment, id])

    async function likeComment(commentId: number, commentAuthor: any, postId: number, author: any) {
        try {
            const injected = await web3FromSource('polkadot-js')
            const unsub: any = await api?.tx['socialMedia']['likeComment'](commentId).signAndSend(user.address, {signer: injected.signer}, (result: any) => {
                console.log(`Current status is ${result.status}`);
                if (result.status.isInBlock) {
                  console.log(`Transcaction included at blockHash ${result.status.asInBlock}`);
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
            const unsub: any = await api?.tx['socialMedia']['unlikeComment'](commentId).signAndSend(user.address, {signer: injected.signer}, (result: any) => {
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

    async function tip(author: string, amount: number) {
        try {
            const injected = await web3FromSource('polkadot-js')
            const unsub: any = await api?.tx['socialMedia']['tip'](author, amount).signAndSend(user.address, {signer: injected.signer}, (result: any) => {
                if(result.status.isInBlock) {
                    unsub()
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

    const { transform, opacity } = useSpring({
        opacity: edit ? 1 : 0,
        transform: `perspective(600px) rotateY(${edit ? 180 : 0}deg)`,
        config: { mass: 5, tension: 500, friction: 80 },
    })

    return(
            <Box className='commentsHeader'> 
                <Avatar src={`https://ipfs.infura.io/ipfs/${userInfoComment[1]}`} />
                <a>@{userInfoComment[0]}</a>
                <p>{props.comment.date}</p>
                <Box className='commentsBody'>{props.comment.comment}</Box>
                <Box className='commentsFooter'>
                    <div>
                        {liked ? renderUnlike() : renderLike()}
                    </div>
                    <div>
                        Tip Author <SiParitysubstrate/>
                    </div>
                </Box>
            </Box>
    )
}