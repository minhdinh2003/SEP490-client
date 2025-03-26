'use client'

import WithHydration from "@/HOC/withHydration"
import './winner.scss'
import { formatPriceVND } from "@/utils/helpers"
const WinnerText = ({winner="Thanhf",price = 100000}:any) => {
return <div className="txt ">
Nguời chiến thắng là {winner}
<p className="text-lg text-red-500 mt-1">{formatPriceVND(price)}</p>
</div>
}
export default WithHydration(WinnerText)