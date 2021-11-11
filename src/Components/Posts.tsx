import { Avatar, Box } from '@mui/material'
import { useRecoilValue, useRecoilState, useSetRecoilState } from 'recoil'
import { posts as p, user as u } from '../Recoil/balanceListener'
import {AiOutlineLike, AiOutlineCaretUp, AiOutlineCaretDown} from 'react-icons/ai'
import {MdAddComment, MdPostAdd} from 'react-icons/md'
import {
    FormControl,
    InputLabel,
    InputAdornment,
    Input,
    Button
} from '@mui/material'
import './app.css'
import Deck from './Deck'
import { 
    get_comments_for_post, 
    pol_api_dev, 
    get_comment_by_count,
    update
} from '../Recoil/recoil'
import { web3FromSource } from '@polkadot/extension-dapp'
import { useState } from 'react'

export default function Posts() {

    const user: any = useRecoilValue(u)
    const posts = useRecoilValue(p)
    const api: any = useRecoilValue(pol_api_dev)
    const comment = useRecoilValue(get_comment_by_count(0))
    const forceUpdate = useSetRecoilState(update)

    console.log(comment)

    async function likePost(postId: number, author: any) {
        try {
            const injected = await web3FromSource('polkadot-js')
            const unsub = await api?.tx['socialMedia']['likePost'](postId, author).signAndSend(user.address, {signer: injected.signer}, (result: any) => {
                console.log(`Current status is ${result.status}`);
            
                if (result.status.isInBlock) {
                  console.log(`Transaction included at blockHash ${result.status.asInBlock}`);
                } else if (result.status.isFinalized) {
                  console.log(`Transaction finalized at blockHash ${result.status.asFinalized}`);
                  forceUpdate(Math.random())
                  unsub();
                }
              })
        } catch(error) {
            console.log(error)
        }
    }

    const addComment = async (postId: number, comment: string, author: any) => {
        try {
            const injected = await web3FromSource('polkadot-js')
            const unsub: any = await api?.tx['socialMedia']['newComment'](postId, comment, author).signAndSend(user.address, {signer: injected.signer}, (result: any) => {
                console.log(`Current status is ${result.status}`);
                if (result.status.isInBlock) {
                  console.log(`Transaction included at blockHash ${result.status.asInBlock}`);
                } else if (result.status.isFinalized) {
                  console.log(`Transaction finalized at blockHash ${result.status.asFinalized}`);
                  forceUpdate(Math.random())
                  unsub();
                }
              })
        } catch(error) {
            console.log(error)
        }
    }

    return(
        <Box className='postContainer'>
            <h1 style={{textAlign: 'center'}}>Posts by @{user.handle}</h1>
            {posts?.slice(0).reverse().map((post: any, i: number) => {
                console.log(post)
                return(
                <>
                    <Photos
                    key={i}
                    images={post.images}
                    />
                    <PostDetails
                    user={user}
                    post={post}
                    like={likePost}
                    addComment={addComment}
                    />
                </>
                )
            })}
        </Box>
    )
}

function Photos(props: any) {
    console.log(props.posts)
    return(
        <Box className='deckContainer'>
            <Deck images={props.images} />
        </Box>
    )
}

function PostDetails(props: any) {

    const [showComments, setShowComments] = useState(false)
    const param = {
        id: props.post.id,
        address: props.post.author
    }
    const comments = useRecoilValue(get_comments_for_post(param))
    const [cmt, setCmt] = useState('')

    const handleChange = ({target: {value, id}}: any) => {
        switch(id) {
            case 'comment': {
                setCmt(value)
                break;
            }
            default: break;
        }
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
                <div onClick={() => props.like(props.post.id, props.post.author)} className='footerItem'>
                    <AiOutlineLike/> {props.post.likes}
                </div>
                <div onClick={() => setShowComments(!showComments)} className='footerItem'>
                    <MdAddComment/> {comments?.length} {showComments ? <AiOutlineCaretUp/> : <AiOutlineCaretDown/>}
                </div>
            </Box>
            {showComments && 
            <Box className='commentsContainer'>
                {comments?.map((comment: any, i: number) => {
                    return(
                        <p key={i}>
                            {comment.comment}
                        </p>
                    )
                })}
                <FormControl sx={{ m: 1, width: 'auto' }} variant="standard">
                    <InputLabel htmlFor="amino-name">Comment Text</InputLabel>
                    <Input
                    id='comment'
                    type='text'
                    value={cmt}
                    onChange={handleChange}
                    placeholder='Pineapple Express'
                    startAdornment={
                        <InputAdornment position='start'>
                            <MdPostAdd/>
                        </InputAdornment>
                    }
                    />
                    <Button color='success' variant='contained' onClick={() => props.addComment(props.post.id, cmt, props.post.author)}>
                        Add Comment
                    </Button>
                </FormControl>
            </Box>}
        </Box>
    )
}