import { useRecoilValue, useSetRecoilState, useRecoilState } from 'recoil'
import { useEffect } from 'react'
import { account, balance, posts, user as u } from '../Recoil/balanceListener'
import { get_pol_acct, pol_api_dev, accounts, get_pol_accts } from '../Recoil/recoil'
import { blockNumber } from '../Recoil/blockListener'
import getBalance from '../utils/getBalance'
import getUser from '../utils/getUser'
import getPosts from '../utils/getPosts'


const useBalanceListener = () => {

    const setAcct = useSetRecoilState(account)
    const allAccounts: any = useRecoilValue(get_pol_accts)
    const setBal = useSetRecoilState(balance)
    const getAcct: any = useRecoilValue(get_pol_acct)
    const bn = useRecoilValue(blockNumber)
    const api = useRecoilValue(pol_api_dev)
    const [user, updateUser] = useRecoilState(u)
    const setAccounts = useSetRecoilState(accounts)
    const setPosts = useSetRecoilState(posts)

    useEffect(() => {
        (async () => {
            setAcct(getAcct)
            setBal(await getBalance(getAcct, api))
            updateUser(await getUser(getAcct, api))
            setPosts(await getPosts(user.address, api))
            setAccounts([...allAccounts])
        })()
    }, [bn])

}

export default useBalanceListener