import { Box } from '@mui/material'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { currentView } from '../Recoil/router'
import { user as u } from '../Recoil/balanceListener'
import './app.css'

export default function Account() {

    const user = useRecoilValue(u)
    const setView = useSetRecoilState(currentView)

    console.log(user)

    return(
        <Box className='container'>
            <h1>My Account</h1>
            <h4>{user?.address}</h4>
            <h4>{user?.fname} {user?.lname}</h4>
            <h5><a onClick={() => setView('landing')}>{`@${user?.handle}`}</a></h5>
            <img style={{maxHeight: '300px', maxWidth: '300px', borderRadius: '100%'}} src={`https://ipfs.io/ipfs/${user?.profileImage}`} alt='profile pic' />
            <h4>Website:</h4>
            <p>{user?.website}</p>
            <h4>Bio:</h4>
            <p>
                {user?.bio}
            </p>
        </Box>
    )
}