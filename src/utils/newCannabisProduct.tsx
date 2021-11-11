import { web3FromSource } from "@polkadot/extension-dapp"
import { v5 } from 'uuid'

export default async function createAminoAcid(api: any, namespace: any, name: string, price: number, inventory: number, imageHash: string, cannabinoids: Array<Array<number>>, terpenes: Array<Array<number>>, acct: string) {
    try {
        const injected = await web3FromSource('polkadot-js')
        const id = v5(name, namespace)
        const hash = await api?.tx['templateModule']['newCannabisProduct'](name, parseInt(id, 16), price, inventory, imageHash, cannabinoids, terpenes).signAnsdSend(acct, {signer: injected.signer})
        return hash
    } catch (error) {
        console.log(error)
    }
}