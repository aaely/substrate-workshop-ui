import { useRecoilValue, useSetRecoilState } from 'recoil'
import { useState, useEffect, useRef, MutableRefObject } from 'react'
import {
    Box,
    FormControl,
    Input,
    InputLabel,
    InputAdornment,
    Button,
} from '@mui/material'
import {
    get_pol_acct,
    pol_api_dev,
    commentsLoading,
} from '../Recoil/recoil'
import {MdPostAdd} from 'react-icons/md'
import CommentDetails from './CommentDetails'
import { web3FromSource } from '@polkadot/extension-dapp'

export default function PostComments(props: any) {

    const api = useRecoilValue(pol_api_dev)
    const acct = useRecoilValue(get_pol_acct)
    const [cmt, setCmt] = useState('')
    const setLoading = useSetRecoilState(commentsLoading)
    const commentRef: MutableRefObject<any> = useRef(null)
    //const [comments, setComments] = useState([])

    useEffect(() => {
        commentRef.current?.focus()
    },[])

    const addComment = async (postId: number, comment: string, author: any) => {
        try {
            const injected = await web3FromSource('polkadot-js')
            const unsub: any = await api?.tx['socialMedia']['newComment']
              (postId, comment, author, new Date(Date.now()).toLocaleString()).
              signAndSend(acct, {signer: injected.signer}, (result: any) => {
                console.log(`Current status is ${result.status}`);
                if (result.status.isInBlock) {
                  console.log(`Transaction included at blockHash ${result.status.asInBlock}`);
                  setCmt('')
                  setLoading(true)
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

    return(
        <Box>
            {props.comments?.map((comment: any, i: number) => {
                return(
                    <div className='commentsContainer' key={i}>
                        <CommentDetails
                        comment={comment}
                        postId={props.postId}
                        postAuthor={props.postAuthor}
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
                ref={commentRef}
                startAdornment={
                    <InputAdornment position='start'>
                        <MdPostAdd/>
                    </InputAdornment>
                }
                />
                <Button color='success' variant='contained' onClick={() => addComment(props.postId, cmt, props.postAuthor)}>
                    Add Comment
                </Button>
            </FormControl>
        </Box>
    )
}