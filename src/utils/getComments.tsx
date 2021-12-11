
export default async function getComments(postId: number, totalComments: number, api: any) {
    try {
        let comments = []
        for(let i = 0; i <= totalComments; i++){
            const res = await api.query['socialMedia']['postCommentByCount'](postId, i)
            const comment = res.toHuman()
            if (comment.content.length > 0) {
                comments.push(res.toHuman())
            }
        }
        return comments
    } catch (error) {
        console.log(error)
    }
}