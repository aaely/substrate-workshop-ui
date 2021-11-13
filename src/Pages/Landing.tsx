import { useRecoilValue, useRecoilState } from 'recoil'
import './app.css'
import { Box, Button } from '@mui/material'
import { useTransition, animated } from 'react-spring'
import NewPost from '../Components/NewPost'
import {MdPostAdd} from 'react-icons/md'
import Posts from '../Components/Posts'
import { newPostFlag } from '../Recoil/forms'
import { balance, user as u } from '../Recoil/balanceListener'
import { 
    is_user_registered, 
    get_pol_accts, 
    pol_api_dev, 
    get_pol_acct 
} from '../Recoil/recoil'
import UserRegistration from './UserRegistration'
import { useState } from 'react'

const Landing =() => {

    const [isNewPost, setIsNewPost] = useRecoilState(newPostFlag)
    const acct = useRecoilValue(get_pol_acct)
    const user = useRecoilValue(u)
    const registered = useRecoilValue(is_user_registered(user.address))
    const allAccounts = useRecoilValue(get_pol_accts)
    const api = useRecoilValue(pol_api_dev)
    const [sending, setSending] = useState(false)
    const bal = useRecoilValue(balance)

    const sendAllAlice = async () => {
        try {
            setSending(true)
            const unsub: any = await api?.tx['balances']['transferAll'](acct, true).signAndSend(allAccounts[0], (result: any) => {
                console.log(`Current status is ${result.status}, recipient is ${acct}`);
            
                if (result.status.isInBlock) {
                  console.log(`Transaction included at blockHash ${result.status.asInBlock}`);
                  setSending(false)
                  unsub()
                } else if (result.status.isFinalized) {
                  console.log(`Transaction finalized at blockHash ${result.status.asFinalized}`);
                }
              })
        } catch(error) {
            console.log(error)
        }
    }

    const transition = useTransition(isNewPost, {
        from: {height: 0, opacity: 0, scale: 0},
        enter: {height: 'auto', opacity: 1, scale: 1},
        leave: {height: 0, opacity: 0, scale: 0}
    })

    const renderIcon = () => {
        return(
            <div style={{position: 'absolute'}} onClick={() => setIsNewPost(!isNewPost)}>
                <MdPostAdd/>
            </div>
        )
    }

    return(
        <Box className="container">
            {!registered && !sending && parseInt(bal?.free) === 0 && <Button variant='contained' color='success' onClick={() => sendAllAlice()}>
                I need funds Homie!    
            </Button>}
            {!registered && sending &&  <Button variant='contained' color='success' onClick={() => sendAllAlice()}>
                Funds Incoming...
            </Button>}
            {registered && transition((style, i) => {
                return(
                    <animated.div style={style}>
                        {i ? <NewPost/> : renderIcon()}
                    </animated.div>
                )
            })}
            <Box className='postContainer'>
                {registered ? <Posts/> : <UserRegistration/>}
            </Box>
        </Box>
    )
}

export default Landing