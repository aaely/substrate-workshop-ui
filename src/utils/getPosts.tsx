
export default async function getPosts(acct: string, api: any) {
    try {
        let posts = []
        const user = await api.query['users']['users'](acct)
        for(let i = user.totalPosts; i > 0 && i > user.totalPosts - 10; i--){
            const res = await api.query['socialMedia']['userPostByCount'](acct, i)
            posts.push(res.toHuman())
        }
        return posts
    } catch (error) {
        console.log(error)
    }
}