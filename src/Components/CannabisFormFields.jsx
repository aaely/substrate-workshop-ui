import { useRecoilValue, useRecoilState, useSetRecoilState } from 'recoil'
import { terpenes as t, 
         cannabinoids as c, 
         cannabisName, 
         cannabisCategory, 
         cannabisPrice, 
         cannabisInventory, 
         cannabisImageBuffer, 
         cannabisTab } from '../Recoil/forms'
import {Input,
        InputLabel,
        InputAdornment,
        FormControl,
        Button,
        Select,
        MenuItem} from '@mui/material';
import {FaCannabis,FaDollarSign} from 'react-icons/fa'
import {SiCheckmarx} from 'react-icons/si'
import { get_all_cannabinoids, 
         get_all_terpenes } from '../Recoil/recoil';
import {GrStorage} from 'react-icons/gr'

export default function CannabisFormFields() {
    
    const allTerpenes = useRecoilValue(get_all_terpenes)
    const allCannabinoids = useRecoilValue(get_all_cannabinoids)
    const [name, setName] = useRecoilState(cannabisName)
    const [price, setPrice] = useRecoilState(cannabisPrice)
    const [inv, setInv] = useRecoilState(cannabisInventory)
    const [cat, setCat] = useRecoilState(cannabisCategory)
    const [buffer, setBuffer] = useRecoilState(cannabisImageBuffer)
    const [cannabinoids, setCanns] = useRecoilState(c)
    const [terpenes, setTerps] = useRecoilState(t)
    const setTab = useSetRecoilState(cannabisTab)

    const handleChange = ({target: {id, value, files}}) => {
        switch(id) {
            case 'cannName': {
                setName(value)
                break;
            }
            case 'cannPrice': {
                setPrice(value)
                break;
            }
            case 'cannInv': {
                setInv(value)
                break;
            }
            case 'image': {
                const reader = new window.FileReader()
                reader.readAsArrayBuffer(files[0])
                reader.onloadend = () => {
                    setBuffer([])
                    setBuffer(Buffer(reader.result))
                }
            }
            default: break;
        }
    }

    const hc = ({target: {value}}) => {
        setCat(value)
    }

    const addTerpene = (terp) => {
        let newTerps = [...terpenes]
        const index = terpenes.findIndex(x => x.id === terp.id)
        if(index < 0) {
            newTerps.push(terp)
            setTerps(newTerps)
            return
        }
        return
    }

    const addCannabinoid = (cann) => {
            let newCanns = [...cannabinoids]
            const index = cannabinoids.findIndex(x => x.id === cann.id)
            if(index < 0) {
                newCanns.push(cann)
                setCanns(newCanns)
                return
            }
            return  
    }
    
    const removeTerpene = (index) => {
        let newTerps = [...terpenes]
        newTerps.splice(index, 1)
        setTerps(newTerps)
    }

    const removeCannabinoid = (index) => {
        let newCanns = [...cannabinoids]
        newCanns.splice(index, 1)
        setCanns(newCanns)
    }

    const renderTerpeneList = () => {
        return(
            <div style={{display: 'flex', flexDirection: 'column', flexWrap: 'wrap', alignContent: 'center', justifyContent: 'center', maxWidth: '45vw'}}>
                <h4>Available Terpenes</h4>
                {allTerpenes?.map((terpene, i) => {
                    return(
                        <h5 style={{textAlign: 'center'}} key={i} onClick={() => addTerpene(terpene)}>{terpene.name}</h5>
                    )
                })}
            </div>
        )
    }

    const renderCannabinoidList = () => {
        return(
            <div style={{display: 'flex', flexDirection: 'column', flexWrap: 'wrap', alignContent: 'center', justifyContent: 'center', maxWidth: '45vw'}}>
                <h4>Available Cannabinoids</h4>
                {allCannabinoids?.map((cannabinoid, i) => {
                    return(
                        <h5 style={{textAlign: 'center'}} key={i} onClick={() => addCannabinoid(cannabinoid)}>{cannabinoid.name}</h5>
                    )
                })}
            </div>
        )
    }

    const renderCurrentTerpenes = () => {
        return(
            <div style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignContent: 'center', justifyContent: 'center', maxWidth: '45vw'}}>
                <h4 style={{width: '100%', textAlign: 'center'}}>Current Terpenes</h4>
                {terpenes?.map((terpene, i) => {
                    return(
                        <p key={i} onClick={() => removeTerpene(i)}>{terpene.name}{'\u00A0'}</p>
                    )
                })}
            </div>
        )
    }

    const renderCurrentCannabinoids = () => {
        return(
            <div style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignContent: 'center', justifyContent: 'center', maxWidth: '45vw'}}>
                <h4 style={{width: '100%', textAlign: 'center'}}>Current Cannabinoids</h4>
                {cannabinoids?.map((cannabinoid, i) => {
                    return(
                        <p key={i} onClick={() => removeCannabinoid(i)}>{cannabinoid.name} {'\u00A0'}</p>
                    )
                })}
            </div>
        )
    }
    
    return(
        <>
            <FormControl sx={{ m: 1, width: '25ch' }} variant="standard">
                <InputLabel htmlFor="amino-name">Product Name</InputLabel>
                <Input
                id='cannName'
                type='text'
                value={name}
                onChange={handleChange}
                placeholder='Pineapple Express'
                startAdornment={
                    <InputAdornment position='start'>
                        <FaCannabis/>
                    </InputAdornment>
                }
                />
                </FormControl>
                <FormControl sx={{ m: 1, width: '25ch' }} variant="standard">
                <InputLabel htmlFor="amino-name">Product Price</InputLabel>
                <Input
                id='cannPrice'
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
                id='cannInv'
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
            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="cat">Category</InputLabel>
                <Select
                id="cat"
                value={cat}
                onChange={hc}
                label="Category"
                >
                <MenuItem value="">
                    <em>None</em>
                </MenuItem>
                <MenuItem value={'Flower'}>Flower</MenuItem>
                <MenuItem value={'ButaneExtract'}>Butane Extract</MenuItem>
                <MenuItem value={'CO2Extract'}>CO2 Extract</MenuItem>
                </Select>
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
                {renderCannabinoidList()}
                {renderCurrentCannabinoids()}
            </div>
            <div style={{display: 'flex', flexDirection: 'row', width: '100vw', justifyContent: 'space-evenly'}}>
                {renderTerpeneList()}
                {renderCurrentTerpenes()}
            </div>
            <Button color='info' variant='contained' onClick={() => setTab(1)}>
                Set Cannabinoid Concentrations
            </Button>
        </>
    )
}