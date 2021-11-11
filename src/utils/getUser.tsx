
export default async function getUser(acct: string, api: any) {
    try {
        const res = await api.query.users.users(acct)
        return res.toHuman()
    } catch (error) {
        console.log(error)
    }
}