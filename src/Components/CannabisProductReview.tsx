import { useRecoilValue } from 'recoil'
import { terpenes as t,
         cannabinoids as c,
         formattedCannabinoids as fc,
         formattedTerpenes as ft,
         cannabisName,
         cannabisCategory,
         cannabisInventory,
         cannabisPrice,
          } from '../Recoil/forms'

export default function CannabisProductReview() {

    const terpenes = useRecoilValue(t)
    const cannabinoids = useRecoilValue(c)
    const formattedCannabinoids = useRecoilValue(fc)
    const formattedTerpenes = useRecoilValue(ft)
    const name = useRecoilValue(cannabisName)
    const inv = useRecoilValue(cannabisInventory)
    const cat = useRecoilValue(cannabisCategory)
    const price = useRecoilValue(cannabisPrice)

    return(
        <>
            <h1>Review</h1>
            <p>Product Name: {name}</p>
            <p>Product Category: {cat}</p>
            <p>Product Inventory: {inv}</p>
            <p>Price: {price}</p>
            <p>Cannabinoids:</p>
            {cannabinoids?.map((cannabinoid: any, i: number) => {
                return(
                    <p key={i}>
                        {cannabinoid.name} {formattedCannabinoids[i][2]}%
                    </p>
                )
            })}
            <p>Terpenes:</p>
            {terpenes?.map((terpene: any, i: number) => {
                return(
                    <p key={i}>
                        {terpene.name} {formattedTerpenes[i][2]}%
                    </p>
                )
            })}
        </>
    )
}