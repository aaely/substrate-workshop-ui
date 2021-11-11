import { balance, account } from '../Recoil/balanceListener'
import { useRecoilValue } from 'recoil'

const Balances = () => {

    const acct = useRecoilValue(account)
    const bal = useRecoilValue(balance)

    return(
        <>
            <span style={{textAlign: 'center'}}><h1>Account: </h1><h5>{acct}</h5></span>
            <span style={{textAlign: 'center'}}><h1>Balance: </h1><h5>{bal.free}</h5></span>
        </>
    )
}

export default Balances