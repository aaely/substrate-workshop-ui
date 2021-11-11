import { useRecoilState, useRecoilValue } from 'recoil'
import { cannabinoids, cannabisTab, formattedCannabinoids } from '../Recoil/forms'
import {Input,
        InputLabel,
        InputAdornment,
        FormControl,
        Button} from '@mui/material';
import {CgMathPercent} from 'react-icons/cg'
import { useState } from 'react'

export default function CannabinoidHandler() {

    const canns = useRecoilValue(cannabinoids)
    const [formCann, setFormCann] = useRecoilState(formattedCannabinoids)
    const [conc, setConc] = useState(0)
    const [tab, setTab] = useState(0)
    const [cannTab, setCannTab] = useRecoilState(cannabisTab)

    const handleChange = ({target: {value}}: any) => {
        setConc(value)
    }

    const resetCannabinoids = () => {
        setConc(0)
        setFormCann([])
        setTab(0)
    }

    const addFormattedTerpene = (t: any, c: any) => {
        const entry = [t.id, t.name, parseInt(c)]
        setFormCann([...formCann, entry])
        setConc(0)
        setTab(tab + 1)
    }

    return(
        <>
            {tab < canns.length && <FormControl sx={{ m: 1, width: '25ch' }} variant="standard">
                <InputLabel htmlFor="amino-name">{canns[tab].name} Concentration %</InputLabel>
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
            {tab < canns.length && <Button color='info' variant='contained' onClick={() => addFormattedTerpene(canns[tab], conc)}>
                Add Cannabinoid
            </Button>}
            <Button variant='contained' color='error' onClick={() => resetCannabinoids()}>Reset Cannabinoids</Button>
            {tab === canns.length && <Button color='success' variant='contained' onClick={() => setCannTab(cannTab + 1)}>
                Set Terpene Concentrations
            </Button>}
        </>
    )
}