import { useRecoilState, useRecoilValue } from 'recoil'
import { terpenes, formattedTerpenes, cannabisTab } from '../Recoil/forms'
import {CgMathPercent} from 'react-icons/cg'
import {Input,
        InputLabel,
        InputAdornment,
        FormControl,
        Button} from '@mui/material';
import { useState } from 'react';

export default function TerpeneHandler() {

    const terps = useRecoilValue(terpenes)
    const [formTerp, setFormTerp] = useRecoilState(formattedTerpenes)
    const [conc, setConc] = useState(0)
    const [tab, setTab] = useState(0)
    const [cannTab, setCannTab] = useRecoilState(cannabisTab)

    const handleChange = ({target: {value}}: any) => {
        setConc(value)
    }

    const resetTerpenes = () => {
        setConc(0)
        setFormTerp([])
        setTab(0)
    }

    const addFormattedTerpene = (t: any, c: any) => {
        const entry = [t.id, t.name, parseInt(c)]
        setFormTerp([...formTerp, entry])
        setConc(0)
        setTab(tab + 1)
    }

    return(
        <>
            {tab < terps.length && <FormControl sx={{ m: 1, width: '25ch' }} variant="standard">
                <InputLabel htmlFor="amino-name">{terps[tab].name} Concentration %</InputLabel>
                    <Input
                    id='conc'
                    type='number'
                    value={conc}
                    onChange={handleChange}
                    placeholder='0'
                    startAdornment={
                        <InputAdornment position='start'>
                            <CgMathPercent/>
                        </InputAdornment>
                    }
                    />
            </FormControl>}
            {tab < terps.length && <Button color='info' variant='contained' onClick={() => addFormattedTerpene(terps[tab], conc)}>
                Add Terpene
            </Button>}
            <Button color='error' variant='contained' onClick={() => resetTerpenes()}>Reset Terpenes</Button>
            {tab === terps.length && <Button color='success' variant='contained' onClick={() => setCannTab(cannTab + 1)}>
                Review
            </Button>}
        </>
    )
}
