
export default async function getComments(postAuthor: string, api: any, postId: number) {
    try {
        const res = await api.query['socialMedia']['commentsByPost'](postId, postAuthor)
        return res.toHuman()
    } catch (error) {
        console.log(error)
    }
}