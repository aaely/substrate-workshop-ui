
export default async function getCannabinoidName(api: any, id: number) {
    try {
        const res = await api.query['templateModule']['cannabinoids'](id)
        console.log(id, res)
        const name = res?.toJSON()
        return name.name
    } catch (error) {
        console.log(error)
    }
}