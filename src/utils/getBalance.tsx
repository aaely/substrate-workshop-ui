
export default async function getBalance(acct: string, api: any) {
    try {
        const bal = await api.query.system.account(acct)
        return bal?.data.toHuman()
    } catch (error) {
        console.log(error)
    }
}