import { useRecoilState, useSetRecoilState, useRecoilValue } from 'recoil'
import { aminoName, aminoCost } from '../Recoil/forms'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button'
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import {SiMoleculer} from 'react-icons/si'
import {FaDollarSign} from 'react-icons/fa'
import { web3FromSource } from '@polkadot/extension-dapp';
import {v5} from 'uuid'
import { get_pol_acct, update, pol_api_dev, namespace } from '../Recoil/recoil';

export default function AminoBuilder() {
    const api = useRecoilValue(pol_api_dev)
    const acct: any = useRecoilValue(get_pol_acct)
    const NAMESPACE = useRecoilValue(namespace)
    const [name, setName] = useRecoilState(aminoName)
    const [cost, setCost] = useRecoilState(aminoCost)
    const forceUpdate = useSetRecoilState(update)

    const handleChange = ({target: {id, value}}: any) => {
        switch(id) {
            case 'aminoName': {
                setName(value)
                break;
            }
            case 'aminoCost': {
                setCost(value)
                break;
            }
            default: break;
        }
    }

    const createAminoAcid = async () => {
        try {
            const injected = await web3FromSource('polkadot-js')
            const id = v5(name, NAMESPACE)
            const unsub: any = await api?.tx['peptides']['createAmino'](name, parseInt(id, 16), parseInt(cost)).signAndSend(acct, {signer: injected.signer}, (result) => {
                console.log(`Current status is ${result.status}`);
            
                if (result.status.isInBlock) {
                  console.log(`Transaction included at blockHash ${result.status.asInBlock}`);
                } else if (result.status.isFinalized) {
                  console.log(`Transaction finalized at blockHash ${result.status.asFinalized}`);
                  unsub();
                }
              })
            console.log(unsub)
            forceUpdate(Math.random())
            setName('')
            setCost(0)
            window.alert(`${parseInt(id, 16)}, ${name} created successfully`)
        } catch(error) {
            console.log(error)
            window.alert('fail')
        }
    }


    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around', height: '100vh'}}>
        <h3>Create an Amino Acid</h3>
        <FormControl sx={{ m: 1, width: '25ch' }} variant="standard">
        <InputLabel htmlFor="amino-name">Amino Acid Name</InputLabel>
          <Input
          id='aminoName'
          type='text'
          value={name}
          onChange={handleChange}
          placeholder='Glutamine'
          startAdornment={
              <InputAdornment position='start'>
                  <SiMoleculer/>
              </InputAdornment>
          }
          />
        </FormControl>
        <FormControl sx={{ m: 1, width: '25ch' }} variant="standard">
        <InputLabel htmlFor="amino-name">Cost per gram</InputLabel>
          <Input
          id='aminoCost'
          type='number'
          value={cost}
          onChange={handleChange}
          startAdornment={
              <InputAdornment position='start'>
                  <FaDollarSign/>
              </InputAdornment>
          }
          />
        </FormControl>
        <Button variant='contained' color='success' onClick={() => createAminoAcid()}>Create Amino Acid</Button>
      </Box>
    );
  }