export default async function checkHasLikedPost(acct: string, id: number, api: any) {
    try {
        const res = await api.query['socialMedia']['hasLikedPost'](id, acct)
        return res.toHuman()
    } catch (error) {
        console.log(error)
    }
}