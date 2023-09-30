import { useRecoilState, useSetRecoilState, useRecoilValue } from 'recoil'
import { terpenes as t, 
         cannabinoids as c, 
         cannabisName, 
         cannabisCategory, 
         cannabisPrice, 
         cannabisInventory, 
         cannabisImageBuffer,
         cannabisTab, 
         cannabisSkipped,
         formattedCannabinoids as f,
         formattedTerpenes as tr} from '../Recoil/forms'
import ipfs from '../utils/ipfs';
import { update, pol_api_dev, get_pol_acct, namespace } from '../Recoil/recoil'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button'
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import { web3FromSource } from '@polkadot/extension-dapp';
import {v5} from 'uuid'
import { currentView } from '../Recoil/router';
import CannabisFormFields from '../Components/CannabisFormFields';
import TerpeneHandler from '../Components/TerpeneHandler';
import CannabinoidHandler from '../Components/CannabinoidHandler';
import CannabisProductReview from '../Components/CannabisProductReview';
import './app.css'

const steps = ['Initial Input', 'Set Cannabinoid Concentrations', 'Set Terpene Concentrations', 'Review']

export default function CannabisProductBuilder() {
    const api = useRecoilValue(pol_api_dev)
    const acct = useRecoilValue(get_pol_acct)
    const NAMESPACE = useRecoilValue(namespace)
    const [name, setName] = useRecoilState(cannabisName)
    const [cat, setCat] = useRecoilState(cannabisCategory)
    const [price, setPrice] = useRecoilState(cannabisPrice)
    const [inv, setInv] = useRecoilState(cannabisInventory)
    const [terpenes, setTerps] = useRecoilState(t)
    const [cannabinoids, setCanns] = useRecoilState(c)
    const [buffer, setBuffer] = useRecoilState(cannabisImageBuffer)
    const forceUpdate = useSetRecoilState(update)
    const setView = useSetRecoilState(currentView)
    const [tab, setTab] = useRecoilState(cannabisTab)
    const [skipped, setSkipped] = useRecoilState(cannabisSkipped)
    const [formattedCannabinoids, setFC] = useRecoilState(f)
    const [formattedTerpenes, setFT] = useRecoilState(tr)

    const createCannabisProduct = async () => {
        try {
            const injected = await web3FromSource('polkadot-js')
            const id = v5(name, NAMESPACE)
            //const imageHash = await saveImage()
            await api?.tx['cannabis']['newCannabisProduct'](parseInt(id, 16), name, price, cat, inv, '', formattedCannabinoids, formattedTerpenes).signAndSend(acct, {signer: injected.signer})
            forceUpdate(Math.random())
            setCanns([])
            setTerps([])
            setFT([])
            setFC([])
            setName('')
            setCat('')
            setPrice(0)
            setInv(0)
            setBuffer([])
            window.alert(`${parseInt(id, 16)}, ${name} created successfully`)
            setTab(0)
            setView('products')
        } catch(error) {
            console.log(error)
            window.alert('fail')
        }
    }

    const isStepOptional = (step) => {
        return step === 2;
      };
    
    const isStepSkipped = (step) => {
    return skipped.has(step);
    };

    const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(tab)) {
        newSkipped = new Set(newSkipped.values());
        newSkipped.delete(tab);
    }

    setTab((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
    };

    const handleBack = () => {
    setTab((prevActiveStep) => prevActiveStep - 1);
    };

    const handleSkip = () => {
    if (!isStepOptional(tab)) {
        // You probably want to guard against something like this,
        // it should never occur unless someone's actively trying to break something.
        throw new Error("You can't skip a step that isn't optional.");
    }

    setTab((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
        const newSkipped = new Set(prevSkipped.values());
        newSkipped.add(tab);
        return newSkipped;
    });
    };

    const handleReset = () => {
    setTab(0);
    };
    
    const saveImage = async () => {
        try {
            const imageHash = await ipfs.add(buffer)
            return imageHash.path
        } catch(error) {
            console.log(error)
        }
    }

    return (
      <Box className='container'>
        <h3>Create a Cannabis Product</h3>
        <Stepper activeStep={tab}>
            {steps.map((label, index) => {
                const stepProps = {};
                const labelProps = {};
                if (isStepOptional(index)) {
                    labelProps.optional = (
                    <Typography variant="caption">Optional</Typography>
                    );
                }
                if (isStepSkipped(index)) {
                    stepProps.completed = false;
                }
                return (
                    <Step key={label} onClick={() => setTab(index)} {...stepProps}>
                    <StepLabel {...labelProps}>{label}</StepLabel>
                    </Step>
                );
                })}
        </Stepper>
        {tab === 0 && <CannabisFormFields/>}
        {tab === 1 && <CannabinoidHandler/>}
        {tab === 2 && <TerpeneHandler/>}
        {tab === 3 && <CannabisProductReview/>}
        {tab === 3 && <Button variant='contained' color='success' onClick={() => createCannabisProduct()}>Create Product</Button>}
      </Box>
    );
  }