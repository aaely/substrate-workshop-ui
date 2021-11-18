
export default async function checkHandleAvailability(id: number, api: any) {
    try {
        const res = await api.query['users']['userHandleAvailability'](id)
        return res.toHuman()
    } catch (error) {
        console.log(error)
    }
}