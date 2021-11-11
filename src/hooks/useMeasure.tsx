import { MutableRefObject, useLayoutEffect } from "react";
import { dims as d } from "../Recoil/router";
import { useRecoilState } from 'recoil'

const useMeasure: Function = (ref: MutableRefObject<any>) => {
    const [dims, setDims] = useRecoilState(d)

    useLayoutEffect(() => {
        const handleResize = () => {
            if(ref.current) {
                setDims({width: ref.current.offsetWidth, height: ref.current.offsetHeight})
            }
        }

        if(ref.current) {
            setDims({width: ref.current.offsetWidth, height: ref.current.offsetHeight})
        }

        window.addEventListener('resize', handleResize)

        return() => {
            window.removeEventListener('resize', handleResize)
        }
    }, [dims])
}

export default useMeasure