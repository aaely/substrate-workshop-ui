import { cart as c, total as t, products } from '../Recoil/cart'
import { get_pol_acct, pol_api_dev, update } from '../Recoil/recoil'
import { useRecoilValue, useSetRecoilState, useRecoilState } from 'recoil'
import { web3FromSource } from '@polkadot/extension-dapp'
import { Box } from '@mui/system'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { styled } from '@mui/material/styles';
import { currentView } from '../Recoil/router'

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));
  
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

export default function Checkout() {

    const api = useRecoilValue(pol_api_dev)
    const acct = useRecoilValue(get_pol_acct)
    const [cart, setCart] = useRecoilState(c)
    const forceUpdate = useSetRecoilState(update)
    const total = useRecoilValue(t)
    const prod = useRecoilValue(products)
    const setView = useSetRecoilState(currentView)

    const purchase = async () => {
        try{
            const injected = await web3FromSource('polkadot-js')
            await api?.tx['orders']['purchase'](prod, new Date(Date.now()).toLocaleDateString(), acct).signAndSend(acct, {signer: injected.signer})
            //await api?.tx['balances']['transfer']('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY', total).signAndSend(acct, {signer: injected.signer})
            forceUpdate(Math.random())
            console.log(new Date(Date.now()).toLocaleDateString())
            setCart([])
            window.alert('success')
            setView('account')
        } catch(error) {
            console.log(error)
        }
    }

    return(
        <Box 
        sx={{display: 'flex', 
             flexDirection: 'column', 
             alignItems: 'center', 
             justifyContent: 'space-evenly',
             alignContent: 'center',
             justifyItems: 'center',
             height: '100vh'}}
        >
            <h1>Cart Items</h1>
            <TableContainer style={{maxWidth: '80%', maxHeight: '80%'}} component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                    <TableRow>
                        <StyledTableCell align='center'>Name</StyledTableCell>
                        <StyledTableCell align="center">Price</StyledTableCell>
                        <StyledTableCell align="center">Quantity</StyledTableCell>
                        <StyledTableCell align="center">Id</StyledTableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {cart?.map((row, i) => (
                        <StyledTableRow key={i}>
                        <StyledTableCell align='center' component="th" scope="row">
                            {row.name}
                        </StyledTableCell>
                        <StyledTableCell align="center">${row.price/100}</StyledTableCell>
                        <StyledTableCell align="center">{row.quantity}</StyledTableCell>
                        <StyledTableCell align="center">{row.id}</StyledTableCell>
                        </StyledTableRow>
                    ))}
                    <TableRow>
                        <TableCell align='center'>
                            Total: ${total}
                        </TableCell>
                    </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <ButtonGroup>
                <Button variant='contained' onClick={() => purchase()}>Purchase</Button>
                <Button color='error' variant='contained' onClick={() => setCart([])}>Empty Cart</Button>
            </ButtonGroup>
        </Box>
    )
}