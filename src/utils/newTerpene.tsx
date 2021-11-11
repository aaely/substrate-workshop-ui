import { web3FromSource } from "@polkadot/extension-dapp"
import { v5 } from 'uuid'

export default async function newTerpene(api: any, namespace: any, name: string, description: string, acct: string) {
    try {
        const injected = await web3FromSource('polkadot-js')
        const id = v5(name, namespace)
        const hash = await api?.tx['templateModule']['newTerpene'](name, parseInt(id, 16), description).signAnsdSend(acct, {signer: injected.signer})
        return hash
    } catch (error) {
        console.log(error)
    }
}