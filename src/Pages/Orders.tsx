import { useRecoilValue } from 'recoil'
import { get_orders } from '../Recoil/recoil'
import { Paper, 
         TableBody,
         Box, 
         TableCell, 
         TableContainer, 
         Table, 
         TableHead, 
         TableRow, 
         styled, 
         tableCellClasses } from '@mui/material'

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
[`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
},
[`&.${tableCellClasses.body}`]: {
    fontSize: 14,
},
}));

export default function Orders() {

    const u: any = useRecoilValue(get_orders)
    console.log(u)

    return(
        <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-evenly', height: '100vh' }}>
        <h1>Orders:</h1>
        <TableContainer style={{maxWidth: '80%', maxHeight: '80%'}} component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                <TableRow>
                    <StyledTableCell align='center'>Order #</StyledTableCell>
                    <StyledTableCell align="center">Products</StyledTableCell>
                    <StyledTableCell align="center">Total</StyledTableCell>
                    <StyledTableCell align="center">Date</StyledTableCell>
                    <StyledTableCell align="center">Id</StyledTableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {u?.map((order: any, i: number) => {
                    return(
                        <StyledTableRow key={i}>
                            <StyledTableCell align='center' component="th" scope="row">
                                {i + 1}
                            </StyledTableCell>
                            <StyledTableCell align="center">{order.products.map((product: any, i: number) => {
                                return(
                                    <p key={i}>{product[0]} | ${product[1]/100} | x{product[2]} </p>
                                )
                            })}</StyledTableCell>
                            <StyledTableCell align="center">${order.total/100}</StyledTableCell>
                            <StyledTableCell align="center">{order.date.toLocaleString()}</StyledTableCell>
                            <StyledTableCell align="center">{order.id}</StyledTableCell>
                        </StyledTableRow>
                    )
                })}
                </TableBody>
            </Table>
        </TableContainer>
    </Box>
    )
}