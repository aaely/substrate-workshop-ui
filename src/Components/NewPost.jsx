import { postText, postImages, commentText, postTab, newPostFlag } from "../Recoil/forms";
import { useRecoilValue, useRecoilState, useSetRecoilState } from 'recoil'
import {Input,
        InputLabel,
        InputAdornment,
        FormControl,
        Button} from '@mui/material';
import {MdPostAdd} from 'react-icons/md'
import { useState } from "react";
import { pol_api_dev, update } from "../Recoil/recoil";
import { web3FromSource } from "@polkadot/extension-dapp";
import ipfs from "../utils/ipfs";
import { account } from "../Recoil/balanceListener";

export default function NewPost() {
    
    const [text, setText] = useRecoilState(postText)
    const [buffer, setBuffer] = useState([])
    const [tab, setTab] = useRecoilState(postTab)
    const [url, setUrl] = useState([])
    const api = useRecoilValue(pol_api_dev)
    const acct = useRecoilValue(account)
    const forceUpdate = useSetRecoilState(update)
    const setFlag = useSetRecoilState(newPostFlag)

    const createPost = async () => {
        try {
            const injected = await web3FromSource('polkadot-js')
            const images = await uploadImages()
            const unsub = await api?.tx['socialMedia']['newPost'](new Date(Date.now()).toLocaleString(), [], [], text, images).signAndSend(acct, {signer: injected.signer}, (result) => {
                console.log(`Current status is ${result.status}`);
                if (result.status.isInBlock) {
                  console.log(`Transaction included at blockHash ${result.status.asInBlock}`);
                  setText('')
                  setUrl([])
                  setBuffer([])
                  forceUpdate(Math.random())
                  setFlag(false)
                  unsub();
                } else if (result.status.isFinalized) {
                  console.log(`Transaction finalized at blockHash ${result.status.asFinalized}`);
                }
              })            
        } catch(error) {
            console.log(error)
        }
    }

    const uploadImages = async () => {
        try {
            let images = []
            for(let i = 0; i < buffer.length; i++) {
                const image = await ipfs.add(buffer[i])
                images.push(image.path)
            }
            return images
        } catch(error) {
            console.log(error)
        }
    }

    const handleChange = ({target: {id, value, files}}) => {
        switch(id) {
            case 'text': {
                setText(value)
                break;
            }
            case 'image': {
                const reader = new window.FileReader()
                const u = URL.createObjectURL(files[0])
                reader.readAsArrayBuffer(files[0])
                reader.onloadend = () => {
                    setBuffer([...buffer, Buffer(reader.result)])
                    setUrl([...url, u])
                }
                break;
            }
            default: break;
        }
    }

    const incTab = () => {
        setTab(tab + 1)
    }

    const decTab = () => {
        setTab(tab - 1)
    }

    const resetImages = () => {
            setBuffer([])
            setUrl([])
    }
    
    const removeImage = (index) => {
        let newBuffer = [...buffer]
        newBuffer.splice(index, 1)
        setBuffer(newBuffer)
        let newUrl = [...url]
        newUrl.splice(index, 1)
        setUrl(newUrl)
    }

    const renderCurrentImages = () => {
        return(
            <div style={{
                display: 'flex', 
                flexDirection: 'row', 
                flexWrap: 'wrap', 
                alignContent: 'center', 
                justifyContent: 'space-evenly',
                alignItems: 'center',
                maxWidth: '95vw',
                paddingBottom: '2vh'
                }}
            >
                <h4 style={{width: '100%', textAlign: 'center'}}>Current Photos</h4>
                {url?.map((u, i) => {
                    console.log(u)
                    return(
                        <img key={i} style={{maxHeight: '20vh', maxWidth: '20vw', borderRadius: '10px'}} onClick={() => removeImage(i)} src={u} alt={i}/>
                    )
                })}
            </div>
        )
    }
    
    return(
        <div style={{
            display: 'flex',
            flexDirection: 'row', 
            flexWrap: 'wrap', 
            alignContent: 'center', 
            justifyContent: 'space-evenly',
            alignItems: 'center',
            maxWidth: '95vw',
            marginTop: '15vh'
        }}>
            <Button variant='contained' color='error' onClick={() => setFlag(false)}>
                Cancel
            </Button>
            <FormControl sx={{ m: 1, width: '25ch' }} variant="standard">
                <InputLabel htmlFor="amino-name">Text for Post</InputLabel>
                <Input
                id='text'
                type='text'
                value={text}
                onChange={handleChange}
                placeholder='Pineapple Express'
                startAdornment={
                    <InputAdornment position='start'>
                        <MdPostAdd/>
                    </InputAdornment>
                }
                />
            </FormControl>
            <label htmlFor='image'>
                <Input
                style={{display: 'none'}}
                id='image'
                accept='image/*'
                type='file'
                onChange={handleChange}
                />
                <Button variant='contained' component='span'>
                    Upload Photo
                </Button>
            </label>
            <div style={{display: 'flex', flexDirection: 'row', width: '100vw', justifyContent: 'space-evenly'}}>
                {buffer.length >= 1 ? renderCurrentImages() : 'No Photos Yet'}
            </div>
            {buffer.length >= 1 && 
            <Button variant='contained' color='error' onClick={() => resetImages()}>
                    Clear Image Buffer
            </Button>}
            <Button color='info' variant='contained' onClick={() => setTab(1)}>
                Set #Hashtags & @Handletags
            </Button>
            <Button color='info' variant='contained' onClick={() => createPost()}>
                Create Post
            </Button>
        </div>
    )
}