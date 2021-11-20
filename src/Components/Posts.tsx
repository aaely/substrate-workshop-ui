import { Box } from '@mui/material'
import { useRecoilValue, useRecoilState } from 'recoil'
import { posts as p, user as u } from '../Recoil/balanceListener'
import { postFeed, currentFeed } from '../Recoil/blockListener'
import './app.css'
import Deck from './Deck'
import { pol_api_dev } from '../Recoil/recoil'
import PostDetails from '../Components/PostDetails'
import { useTransition, animated } from 'react-spring'

const feedMap = new Map([
    ['liveFeed', <LiveFeed/>],
    ['myposts', <MyPosts/>],
])

export default function Posts() {

    const [activeFeed, setFeed] = useRecoilState(currentFeed)
    const transition = useTransition(activeFeed, {
        from: {scale: 0, opacity: 0},
        enter: {scale: 1, opacity: 1},
        leave: {scale: 0, opacity: 0},
    })
    
    return(
        <>
            <div className='feedBanner'>
                <h3 onClick={() => setFeed('liveFeed')}>Live Feed</h3>
                <h3 onClick={() => setFeed('myposts')}>My Posts</h3>
                <h3 onClick={() => setFeed('followers')}>Posts of Following</h3>
            </div>
            {transition((style, i) => {
                return(
                    <animated.div style={style}>
                        {feedMap.get(i)}
                    </animated.div>
                )
            })}
        </>
    )
}

function Photos(props: any) {
    return(
        <Box className='deckContainer'>
            <Deck images={props.images} />
        </Box>
    )
}

function MyPosts(props: any) {
    const myPosts = useRecoilValue(p)
    const user = useRecoilValue(u)
    return(
        <Box className='postContainer'>
            <h1 style={{textAlign: 'center'}}>Posts by @{user.handle}</h1>
            {myPosts?.slice(0).reverse().map((post: any, i: number) => {
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

function LiveFeed(props: any) {
    const posts = useRecoilValue(postFeed)
    const user = useRecoilValue(u)
    return(
        <Box className='postContainer'>
            <h1 style={{textAlign: 'center'}}>Hello @{user.handle} check out the live feed:</h1>
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