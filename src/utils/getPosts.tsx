
export default async function getPosts(acct: string, api: any) {
    try {
        const res = await api.query['socialMedia']['accountAllPosts'](acct)
        return res.toHuman()
    } catch (error) {
        console.log(error)
    }
}