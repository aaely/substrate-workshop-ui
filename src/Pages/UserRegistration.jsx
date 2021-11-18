import { useRecoilState, useSetRecoilState, useRecoilValue } from 'recoil'
import { useState, useRef } from 'react';
import ipfs from '../utils/ipfs'
import { 
    fName, 
    lName, 
    phone as p, 
    email as e, 
    handle as h, 
    bio as b, 
    website as w, 
    handleAvailability
    } from '../Recoil/forms'
import { 
    update, 
    pol_api_dev, 
    get_pol_acct, 
    namespace 
    } from '../Recoil/recoil'
import {
    Box,
    Button,
    Input,
    InputLabel,
    InputAdornment,
    FormControl,
    FormHelperText
    } from '@mui/material/';
import { v5 } from 'uuid'
import {BsPhoneFill, BsGlobe} from 'react-icons/bs'
import {SiCheckmarx} from 'react-icons/si'
import {MdAlternateEmail} from 'react-icons/md'
import { web3FromSource } from '@polkadot/extension-dapp';
import {GrContactInfo, GrMail} from 'react-icons/gr'
import './app.css'
import useDebounce from '../hooks/useDebounce';
import useUpdateEffect from '../hooks/useUpdateEffect';
import checkHandleAvailability from '../utils/checkHandleAvailability'
import checkEmailAvailability from '../utils/checkEmailAvailability'


export default function UserRegistration() {
    const api = useRecoilValue(pol_api_dev)
    const acct = useRecoilValue(get_pol_acct)
    const NAMESPACE = useRecoilValue(namespace)
    const [bio, setBio] = useRecoilState(b)
    const [currentHandleId, setCurrentHandleId] = useState()
    const [currentEmailId, setCurrentEmailId] = useState()
    const [website, setWebsite] = useRecoilState(w)
    const [fname, setfName] = useRecoilState(fName)
    const [lname, setlName] = useRecoilState(lName)
    const [phone, setPhone] = useRecoilState(p)
    const [email, setEmail] = useRecoilState(e)
    const [handle, setHandle] = useRecoilState(h)
    const [buffer, setBuffer] = useState([])
    const [isHandleAvailable, setIsHandleAvailable] = useState(true)
    const [isEmailAvailable, setIsEmailAvailable] = useState(true)
    useDebounce(() => updateHandleId(handle, NAMESPACE, setCurrentHandleId), 3000, [handle])
    useDebounce(() => updateEmailId(email, NAMESPACE, setCurrentEmailId), 3000, [email])
    const forceUpdate = useSetRecoilState(update)
    const handleRef = useRef(null)

    const updateHandleId = (h, n, s) => {
        const id = v5(h, n)
        s(parseInt(id, 16))
    }

    const updateEmailId = (e, n, s) => {
        const id = v5(e, n)
        s(parseInt(id, 16))
    }

    useUpdateEffect(() => {
        if(!handleRef.current?.focus()){
            handleRef.current?.focus()
        }
        (async () => {
            try {
                const availableHandle = await checkHandleAvailability(currentHandleId, api)
                const availableEmail = await checkEmailAvailability(currentEmailId, api)
                setIsHandleAvailable(availableHandle)
                setIsEmailAvailable(availableEmail)
                handleRef.current?.focus()
            } catch(error) {
                console.log(error)
            }
        })()
    },[currentHandleId])

    const handleChange = ({target: {id, value, files}}) => {
        switch(id) {
            case 'fName': {
                setfName(value)
                break;
            }
            case 'lName': {
                setlName(value)
                break;
            }
            case 'phone': {
                setPhone(value)
                break;
            }
            case 'email': {
                setEmail(value)
                break;
            }
            case 'handle': {
                setHandle(value)
                break;
            }
            case 'bio': {
                setBio(value)
                break;
            }
            case 'website': {
                setWebsite(value)
                break;
            }
            case 'profileImage': {
                const reader = new window.FileReader()
                reader.readAsArrayBuffer(files[0])
                reader.onloadend = () => {
                    setBuffer([])
                    setBuffer(Buffer(reader.result))
                }
                break;
            }
            default: break;
        }
    }

    const saveImage = async () => {
        try {
            if(buffer.length > 0) {
                console.log('...adding')
                const imageHash = await ipfs.add(buffer)
                console.log(`... added ${imageHash.path}`)
                return imageHash.path
            }
        } catch (error) {
            console.log(error)
        }
    }

    const createUser = async () => {
        try{
            const injected = await web3FromSource('polkadot-js')
            const imageHash = await saveImage()
            console.log(acct)
            const unsub = await api?.tx['users']['newUser'](fname, lname, phone, email, currentEmailId, handle, currentHandleId, bio, website, imageHash).signAndSend(acct, {signer: injected.signer}, (result) => {
                console.log(`Current status is ${result.status}`);
            
                if (result.status.isInBlock) {
                  console.log(`Transaction included at blockHash ${result.status.asInBlock}`);
                } else if (result.status.isFinalized) {
                  console.log(`Transaction finalized at blockHash ${result.status.asFinalized}`);
                  unsub();
                }
              })
            forceUpdate(Math.random())
            setfName('')
            setlName('')
            setPhone('')
            setEmail('')
            setWebsite('')
            setBio('')
            window.alert(`${parseInt(acct)}, ${fName} ${lName} created successfully`)
            unsub()
        } catch(error) {
            console.log(error)
        }
    }


    return (
      <Box className='container'>      
        <h3>New User Registration Form</h3>
        <FormControl sx={{ m: 1, width: '25ch' }} variant="standard">
        <InputLabel htmlFor="fname">First Name</InputLabel>
          <Input
          id='fName'
          type='text'
          value={fname}
          onChange={handleChange}
          placeholder='John'
          />
        </FormControl>
        <FormControl sx={{ m: 1, width: '25ch' }} variant="standard">
        <InputLabel htmlFor="lname">Last Name</InputLabel>
          <Input
          id='lName'
          type='text'
          value={lname}
          onChange={handleChange}
          placeholder='Smith'
          />
        </FormControl>
        <FormControl sx={{ m: 1, width: '25ch' }} variant="standard">
        <InputLabel htmlFor="phone">Phone</InputLabel>
          <Input
          id='phone'
          type='text'
          value={phone}
          onChange={handleChange}
          startAdornment={
              <InputAdornment position='start'>
                  <BsPhoneFill/>
              </InputAdornment>
          }
          />
        </FormControl>
        <FormControl sx={{ m: 1, width: '25ch' }} variant="standard">
        <InputLabel htmlFor="email">Email</InputLabel>
          <Input
          id='email'
          type='text'
          value={email}
          onChange={handleChange}
          placeholder='some.email@gmail.com'
          startAdornment={
              <InputAdornment position='start'>
                  <GrMail/>
              </InputAdornment>
          }
          />
          {isEmailAvailable ? 
            <FormHelperText style={{color: 'red'}} id="component-error-text">Email already in use</FormHelperText> : 
            <FormHelperText style={{color: 'green'}} id="component-error-text">Email is available!</FormHelperText>
          }
        </FormControl>
        <FormControl sx={{ m: 1, width: '25ch' }} variant="standard">
        <InputLabel htmlFor="handle">Handle</InputLabel>
          <Input
          id='handle'
          type='text'
          value={handle}
          onChange={handleChange}
          placeholder='somehandle1234'
          startAdornment={
              <InputAdornment position='start'>
                  <MdAlternateEmail/>
              </InputAdornment>
          }
          />
          {isHandleAvailable ? 
          <FormHelperText style={{color: 'red'}} id="component-error-text">
              Handle already in use
          </FormHelperText>
          : 
          <FormHelperText style={{color: 'green'}} id="component-error-text">
              Handle is available!
          </FormHelperText>
          }
        </FormControl>
        <FormControl sx={{ m: 1, width: '25ch' }} variant="standard">
        <InputLabel htmlFor="handle">Bio</InputLabel>
          <Input
          id='bio'
          type='text'
          value={bio}
          onChange={handleChange}
          placeholder='some.email@gmail.com'
          startAdornment={
              <InputAdornment position='start'>
                  <GrContactInfo/>
              </InputAdornment>
          }
          />
        </FormControl>
        <FormControl sx={{ m: 1, width: '25ch' }} variant="standard">
        <InputLabel htmlFor="handle">Website</InputLabel>
          <Input
          id='website'
          type='text'
          value={website}
          onChange={handleChange}
          placeholder='some.email@gmail.com'
          startAdornment={
              <InputAdornment position='start'>
                  <BsGlobe/>
              </InputAdornment>
          }
          />
        </FormControl>
        <label htmlFor='profileImage'>
          <Input
          style={{display: 'none'}}
          id='profileImage'
          accept='image/*'
          type='file'
          onChange={handleChange}
          />
          <Button variant='contained' component='span'>
              Upload Photo
          </Button>
          </label>
          {buffer.length > 1 ? <SiCheckmarx/> : 'No Photo Yet'}
        <Button variant='contained' color='success' onClick={() => createUser()}>Register</Button>
      </Box>
    );
  }