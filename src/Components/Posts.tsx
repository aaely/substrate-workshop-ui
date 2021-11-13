import { Box } from '@mui/material'
import { useRecoilValue } from 'recoil'
import { posts as p, user as u } from '../Recoil/balanceListener'
import './app.css'
import Deck from './Deck'
import { pol_api_dev } from '../Recoil/recoil'
import PostDetails from '../Components/PostDetails'

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
