import { useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { pol_api_dev, get_pol_acct } from '../Recoil/recoil'
import { blockNumber as b, finalizedBlockNumber as f, eventFeed as e } from '../Recoil/blockListener'

const FILTERED_EVENTS = [
    'system:ExtrinsicSuccess:: (phase={"ApplyExtrinsic":0})',
    'system:ExtrinsicSuccess:: (phase={"ApplyExtrinsic":1})'
  ];

const useChainListener = () => {

    const api = useRecoilValue(pol_api_dev)
    const setBlockNumber = useSetRecoilState(b);
    const setFinalizedBlockNumber = useSetRecoilState(f);
    const setFeed: any = useSetRecoilState(e)
    const bn = useRecoilValue(b)

    useEffect(() => {
        (async () => {
            await api?.rpc.chain.subscribeNewHeads((header: any) => {
                setBlockNumber(header.number.toHuman())
            })
            await api?.rpc.chain.subscribeFinalizedHeads((header: any) => {
                setFinalizedBlockNumber(header.number.toHuman())
            })
            await api?.query.system.events(events => {
                events.forEach(record => {
                    const { event, phase } = record
                    const types = event.typeDef
                    const eventName = `${event.section}:${event.method}:: (phase=${phase.toString()})`
                    if (FILTERED_EVENTS.includes(eventName)) return
                    const params = event.data.map((data, index) => `${types[index].type}: ${data.toString()}`)
                    setFeed((ev: any) => [{
                        icon: 'bell',
                        summary: `${eventName}-${ev.length}`,
                        extraText: event.meta.docs.join(', ').toString(),
                        content: params.join(', ')
                    }, ...ev])
                })
            })
        })()
    }, [bn])
}

export default useChainListener