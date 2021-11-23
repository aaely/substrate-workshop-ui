import { Avatar, Box } from '@mui/material'
import { useRecoilValue } from 'recoil'
import {AiOutlineLike, AiOutlineCaretUp, AiOutlineCaretDown} from 'react-icons/ai'
import {MdAddComment} from 'react-icons/md'
import './app.css'
import {
    pol_api_dev, 
} from '../Recoil/recoil'
import { web3FromSource } from '@polkadot/extension-dapp'
import { useState, useEffect } from 'react'
import { useTransition, animated } from 'react-spring'
import PostComments from './PostComments'
import checkHasLikedPost from '../utils/checkHasLikedPost'

export default function PostDetails(props: any) {

    const [showComments, setShowComments] = useState(false)
    const api = useRecoilValue(pol_api_dev)
    const [liked, setLiked] = useState(false)
    

    useEffect(() => {
        (async() => {
            setLiked(await checkHasLikedPost(props.user.address, props.post.id, api))
        })()
    },[props.post.likes, props.post])

    useEffect(() => {
        if(props.index === 0) {
            setShowComments(true)
        }
    },[])

    async function likePost(postId: number, author: any) {
        try {
            const injected = await web3FromSource('polkadot-js')
            const unsub: any = await api?.tx['socialMedia']['likePost'](postId, author).signAndSend(props.user.address, {signer: injected.signer}, (result: any) => {
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

    async function unlikePost(postId: number, author: any) {
        try {
            const injected = await web3FromSource('polkadot-js')
            const unsub: any = await api?.tx['socialMedia']['unlikePost'](postId, author).signAndSend(props.user.address, {signer: injected.signer}, (result: any) => {
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
                <div onClick={() => likePost(props.post.id, props.post.author)} className='footerItem'>
                    <AiOutlineLike/> {props.post.likes}
                </div>
        )
    }

    const renderUnlike = () => {
        return(
                <div onClick={() => unlikePost(props.post.id, props.post.author)} className='footerItem'>
                    Unlike {props.post.likes}
                </div>
        )
    }

    return(
        <Box className='bodyContainer'>
            <Box className='bodyHeader'>
                <Avatar src={`https://ipfs.io/ipfs/${props.user.profileImage}`} />
                <Box>
                    <p>{props.user.address}</p>
                    <p>@{props.user.handle}</p>
                </Box>
                <p>{props.post.date}</p>
            </Box>
            <Box className='bodyText'>
                {props.post.content}
            </Box>
            <Box className='bodyFooter'>
                {liked ? renderUnlike() : renderLike()}
                <div onClick={() => setShowComments(!showComments)} className='footerItem'>
                    <MdAddComment/> {props.post.comments?.length} {showComments ? <AiOutlineCaretUp/> : <AiOutlineCaretDown/>}
                </div>
            </Box>
            {showComments &&
                <PostComments 
                postId={props.post.id} 
                postAuthor={props.post.author} 
                comments={props.post.comments}
                />
            }
        </Box>
    )
}