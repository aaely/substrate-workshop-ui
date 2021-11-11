import { useRecoilState, useSetRecoilState, useRecoilValue } from 'recoil'
import { terpeneName, terpeneDesc } from '../Recoil/forms'
import { update, pol_api_dev, get_pol_acct, namespace } from '../Recoil/recoil'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button'
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import {SiMoleculer} from 'react-icons/si'
import {MdOutlineDescription} from 'react-icons/md'
import { web3FromSource } from '@polkadot/extension-dapp';
import {v5} from 'uuid'
import { currentView } from '../Recoil/router';

export default function TerpeneBuilder() {
    const api = useRecoilValue(pol_api_dev)
    const acct: any = useRecoilValue(get_pol_acct)
    const NAMESPACE = useRecoilValue(namespace)
    const [name, setName] = useRecoilState(terpeneName)
    const [desc, setDesc] = useRecoilState(terpeneDesc)
    const forceUpdate = useSetRecoilState(update)
    const changePage = useSetRecoilState(currentView)

    const handleChange = ({target: {id, value}}: any) => {
        switch(id) {
            case 'terpName': {
                setName(value)
                break;
            }
            case 'terpDesc': {
                setDesc(value)
                break;
            }
            default: break;
        }
    }

    const createTerpene = async () => {
        try {
            const injected = await web3FromSource('polkadot-js')
            const id = v5(name, NAMESPACE)
            await api?.tx['cannabis']['newTerpene']( parseInt(id, 16), name, desc).signAndSend(acct, {signer: injected.signer})
            forceUpdate(Math.random())
            setName('')
            setDesc('')
            window.alert(`${parseInt(id, 16)}, ${name} created successfully`)
        } catch(error) {
            console.log(error)
            window.alert('fail')
        }
    }


    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-evenly', height: '100vh' }}>      
        <h3>Create a Terpene</h3>
        <FormControl sx={{ m: 1, width: '25ch' }} variant="standard">
        <InputLabel htmlFor="terp-name">Terpene Name</InputLabel>
          <Input
          id='terpName'
          type='text'
          value={name}
          onChange={handleChange}
          placeholder='Pinene'
          startAdornment={
              <InputAdornment position='start'>
                  <SiMoleculer/>
              </InputAdornment>
          }
          />
        </FormControl>
        <FormControl sx={{ m: 1, width: '25ch' }} variant="standard">
        <InputLabel htmlFor="terp-desc">Description</InputLabel>
          <Input
          id='terpDesc'
          type='text'
          value={desc}
          onChange={handleChange}
          startAdornment={
              <InputAdornment position='start'>
                  <MdOutlineDescription/>
              </InputAdornment>
          }
          />
        </FormControl>
        <Button variant='contained' color='success' onClick={() => createTerpene()}>Create Terpene</Button>
      </Box>
    );
  }