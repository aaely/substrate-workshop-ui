import { useRecoilState, useSetRecoilState, useRecoilValue } from 'recoil'
import { useState } from 'react'
import { peptideName, peptideCost, peptideInventory, chain as c } from '../Recoil/forms'
import { update, pol_api_dev, namespace, get_all_aminos, get_pol_acct } from '../Recoil/recoil'
import Box from '@mui/material/Box';
import ipfs from '../utils/ipfs';
import Button from '@mui/material/Button'
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import {SiMoleculer, SiCheckmarx} from 'react-icons/si'
import {FaDollarSign} from 'react-icons/fa'
import { web3FromSource } from '@polkadot/extension-dapp';
import {v5} from 'uuid'
import { currentView } from '../Recoil/router';
import {GrStorage} from 'react-icons/gr'


export default function PeptideBuilder() {
    const api = useRecoilValue(pol_api_dev)
    const acct = useRecoilValue(get_pol_acct)
    const NAMESPACE = useRecoilValue(namespace)
    const [name, setName] = useRecoilState(peptideName)
    const [price, setPrice] = useRecoilState(peptideCost)
    const [inv, setInv] = useRecoilState(peptideInventory)
    const [chain, setChain] = useRecoilState(c)
    const forceUpdate = useSetRecoilState(update)
    const allAminos = useRecoilValue(get_all_aminos)
    const [buffer, setBuffer] = useState([])

    console.log(buffer.length, buffer)

    const handleChange = ({target: {id, value, files}}) => {
        switch(id) {
            case 'peptideName': {
                setName(value)
                break;
            }
            case 'peptidePrice': {
                setPrice(value)
                break;
            }
            case 'peptideInv': {
                setInv(value)
                break;
            }
            case 'image': {
                const reader = new window.FileReader()
                if(files.length > 0) {
                    reader.readAsArrayBuffer(files[0])
                    reader.onloadend = () => {
                        setBuffer([])
                        setBuffer(Buffer(reader.result))
                    }
                    break;
                }
                break;
            }
            default: break;
        }
    }

    const addAmino = (amino) => {
        let newChain = [...chain]
        newChain.push(amino)
        setChain(newChain)
    }
    
    const removeAmino = (index) => {
        let newChain = [...chain]
        newChain.splice(index, 1)
        setChain(newChain)
    }

    const uploadImage = async () => {
        try {
            const imageHash = await ipfs.add(buffer)
            console.log(imageHash)
            return imageHash
        } catch(error) {
            console.log(error)
        }
    }

    const createPeptide = async () => {
        try {
            const injected = await web3FromSource('polkadot-js')
            const id = v5(name, NAMESPACE)
            const imageHash = await uploadImage()
            await api?.tx['peptides']['createPeptide'](name, parseInt(id, 16), price, inv, imageHash.path, chain).signAndSend(acct, {signer: injected.signer})
            forceUpdate(Math.random())
            setBuffer([])
            setChain([])
            setName('')
            setInv(0)
            setPrice(0)
            window.alert(`${parseInt(id, 16)}, ${name} created successfully`)
        } catch(error) {
            console.log(error)
            window.alert('fail')
        }
    }

    const renderAminoList = () => {
        return(
            <div style={{display: 'flex', flexDirection: 'column', flexWrap: 'wrap', alignContent: 'center', justifyContent: 'center', maxWidth: '45vw'}}>
                <h4 style={{width: '100%', textAlign: 'center'}}>Available Amino Acids:</h4>
                {allAminos?.map((amino, i) => {
                    return(
                        <h5 style={{textAlign: 'center'}} key={i} onClick={() => addAmino(amino)}>{amino.name}</h5>
                    )
                })}
            </div>
        )
    }

    const clearChain = () => {
        setChain([])
    }

    const renderChain = () => {
        return(
            <div style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignContent: 'center', justifyContent: 'center', maxWidth: '45vw'}}>
                <h4 style={{width: '100%', textAlign: 'center'}} onClick={() => clearChain()}>Current Chain | Length: {chain.length}</h4>
                {chain?.map((amino, i) => {
                    return(
                        <span key={i} onClick={() => removeAmino(i)}>--{amino.name}--</span>
                    )
                })}
            </div>
        )
    }

    return (
      <Box className='container'>
        <h3>Create a Peptide</h3>
        <FormControl sx={{ m: 1, width: '25ch' }} variant="standard">
        <InputLabel htmlFor="amino-name">Peptide Name</InputLabel>
          <Input
          id='peptideName'
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
        <InputLabel htmlFor="amino-name">Peptide Price</InputLabel>
          <Input
          id='peptidePrice'
          type='number'
          value={price}
          onChange={handleChange}
          startAdornment={
              <InputAdornment position='start'>
                  <FaDollarSign/>
              </InputAdornment>
          }
          />
        </FormControl>
        <FormControl sx={{ m: 1, width: '25ch' }} variant="standard">
        <InputLabel htmlFor="amino-name">Inventory in grams</InputLabel>
          <Input
          id='peptideInv'
          type='number'
          value={inv}
          onChange={handleChange}
          startAdornment={
              <InputAdornment position='start'>
                  <GrStorage/>
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
          {buffer.length > 1 ? <SiCheckmarx/> : 'No Photo Yet'}
        <div style={{display: 'flex', flexDirection: 'row', width: '100vw', justifyContent: 'space-evenly'}}>
            {renderAminoList()}
            {renderChain()}
        </div>
        <Button variant='contained' color='success' onClick={() => createPeptide()}>Create Amino Acid</Button>
      </Box>
    );
  }