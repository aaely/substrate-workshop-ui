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
    has_liked_post,
    get_user_profile_image,
    update,
    has_liked_comment,
} from '../Recoil/recoil'
import { web3FromSource } from '@polkadot/extension-dapp'
import { useEffect, useState } from 'react'
import { useSpring, animated } from 'react-spring'

export default function Posts() {

    const user: any = useRecoilValue(u)
    const posts = useRecoilValue(p)
    const api: any = useRecoilValue(pol_api_dev)

    return(
        <Box className='postContainer'>
            <h1 style={{textAlign: 'center'}}>Posts by @{user.handle}</h1>
            {posts?.slice(0).reverse().map((post: any, i: number) => {
                return(
                <div key={i}>
                    <Photos
                    images={post.images}
                    />
                    <PostDetails
                    user={user}
                    post={post}
                    />
                </div>
                )
            })}
        </Box>
    )
}

function Photos(props: any) {
    return(
        <Box className='deckContainer'>
            <Deck images={props.images} />
        </Box>
    )
}

function PostDetails(props: any) {

    const [showComments, setShowComments] = useState(false)
    const api = useRecoilValue(pol_api_dev)
    const param = {
        id: props.post.id,
        address: props.post.author
    }
    const hasLikedPost = useRecoilValue(has_liked_post(param))
    const [cmt, setCmt] = useState('')
    const [loading, setLoading] = useState(true)
    const [liked, setLiked] = useState(true)

    useEffect(() => {
        if(loading) {
            setLiked(hasLikedPost)
            setLoading(false)
        }
    })

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

    const addComment = async (postId: number, comment: string, author: any) => {
        try {
            const injected = await web3FromSource('polkadot-js')
            const unsub: any = await api?.tx['socialMedia']['newComment'](postId, comment, author, new Date(Date.now()).toLocaleString()).signAndSend(props.user.address, {signer: injected.signer}, (result: any) => {
                console.log(`Current status is ${result.status}`);
                if (result.status.isInBlock) {
                  console.log(`Transaction included at blockHash ${result.status.asInBlock}`);
                  setCmt('')
                  unsub();
                } else if (result.status.isFinalized) {
                  console.log(`Transaction finalized at blockHash ${result.status.asFinalized}`);
                }
              })
        } catch(error) {
            console.log(error)
        }
    }

    const handleChange = ({target: {value, id}}: any) => {
        switch(id) {
            case 'comment': {
                setCmt(value)
                break;
            }
            default: break;
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
                    <MdAddComment/> {props.post.totalComments} {showComments ? <AiOutlineCaretUp/> : <AiOutlineCaretDown/>}
                </div>
            </Box>
            {showComments &&
            <Box>
                {props.post.comments?.map((comment: any, i: number) => {
                    return(
                        <div className='commentsContainer' key={i}>
                            <CommentDetails
                            comment={comment}
                            postId={props.post.id}
                            postAuthor={props.post.author}
                            />
                        </div>
                    )
                })}
                <FormControl sx={{ m: 1, width: '95%', paddingLeft: '1%', paddingRight: '1%'}} variant="standard">
                    <InputLabel htmlFor="amino-name">Comment Text</InputLabel>
                    <Input
                    id='comment'
                    type='text'
                    value={cmt}
                    onChange={handleChange}
                    placeholder='Whats on your mind....'
                    startAdornment={
                        <InputAdornment position='start'>
                            <MdPostAdd/>
                        </InputAdornment>
                    }
                    />
                    <Button color='success' variant='contained' onClick={() => addComment(props.post.id, cmt, props.post.author)}>
                        Add Comment
                    </Button>
                </FormControl>
            </Box>}
        </Box>
    )
}

function CommentDetails(props: any) {
    const api = useRecoilValue(pol_api_dev)
    console.log(props)
    const param = {
        id: props.comment.id,
        author: props.comment.author,
    }
    const userInfoComment = useRecoilValue(get_user_profile_image(props.comment.author))
    const hasLikedComment = useRecoilValue(has_liked_comment(param))
    const [loading, setLoading] = useState(true)
    const [liked, setLiked] = useState(false)

    useEffect(() => {
        if(loading){
            setLiked(hasLikedComment)
            setLoading(false)
        }
    })

    async function likeComment(postId: number, author: any) {
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

    async function unlikeComment(postId: number, author: any) {
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
                <div onClick={() => likeComment(props.post.id, props.post.author)} className='footerItem'>
                    <AiOutlineLike/> {props.comment.likes}
                </div>
        )
    }

    const renderUnlike = () => {
        return(
                <div onClick={() => unlikeComment(props.post.id, props.post.author)} className='footerItem'>
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
                        {liked ? renderLike() : renderUnlike()}
                    </div>
                </div>
            </Box>
    )
}