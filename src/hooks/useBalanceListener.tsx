import { useEffect } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { account, balance, posts, user } from '../Recoil/balanceListener'
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
    const updateUser = useSetRecoilState(user)
    const setAccounts = useSetRecoilState(accounts)
    const updatePosts = useSetRecoilState(posts)

    useEffect(() => {
        (async () => {
            setAcct(getAcct)
            setBal(await getBalance(getAcct, api))
            updateUser(await getUser(getAcct, api))
            updatePosts(await getPosts(getAcct, api))
            setAccounts([...allAccounts])
        })()
    }, [bn])

}

export default useBalanceListener