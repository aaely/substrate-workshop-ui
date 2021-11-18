
export default async function checkEmailAvailability(id: number, api: any) {
    try {
        const res = await api.query['users']['userEmailAvailability'](id)
        return res.toHuman()
    } catch (error) {
        console.log(error)
    }
}