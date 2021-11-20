export default async function checkHasLikedComment(acct: string, id:number, api: any) {
    try {
        const res = await api.query['socialMedia']['hasLikedComment'](id, acct)
        return res.toHuman()
    } catch (error) {
        console.log(error)
    }
}