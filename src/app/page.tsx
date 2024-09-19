"use client"

import { useState } from "react"
import { newTable } from "@/app/table"
import { diameterTable, impellerTable, keyTable, motorOutputTable, motorTable, pumpEfficiencyTable } from "@/app/data"
import { useSearchParams } from "next/navigation"
import { TableView } from "@/app/table-view"
import pageStyles from "@/app/page.module.css"

export default function Page() {
  const searchParams = useSearchParams()
  const [quantity, setQuantity] = useState(Number(searchParams.get("q")) || 0)
  const [head, setHead] = useState(Number(searchParams.get("h")) || 0)
  const [frequency, setFrequency] = useState(Number(searchParams.get("f")) || 0)

  const data = newTable(
    "データ",
    ["quantity", "head", "freq"] as const,
    ["流量", "全揚程", "消費電力"],
    [[quantity, head, frequency]],
  )
    .selectAll(motorTable, (row) => {
      // 電動機回転数の選定
      if (row.freq !== row.motorFreq) return false
      const speedRatio = (row.motorRev * Math.sqrt(row.quantity)) / Math.pow(row.head, 3 / 4)
      return 140 <= speedRatio && speedRatio <= 300
    })
    .append(["speedRatio"], ["比速度"], (row) => ({
      speedRatio: (row.motorRev * Math.sqrt(row.quantity)) / Math.pow(row.head, 3 / 4),
    }))
    .select(pumpEfficiencyTable.reverse(), (row) => {
      // ポンプ効率の決定
      if (row.speedRatio < row.pumpSpeedRatioMin) return false
      if (row.speedRatio > row.pumpSpeedRatioMax) return false
      return row.quantity > row.pumpQuantity
    })
    .append(["shaftWattage"], ["軸動力"], (row) => ({
      shaftWattage: (9.8 * 1000 * row.quantity * row.head) / (1000 * 60 * row.pumpEfficiency),
    }))
    .select(motorOutputTable, (row) => {
      // 電動機出力の決定
      return row.motorOutput > row.shaftWattage * 1.1
    })
    .append(["minDiameter"], ["_軸径"], (row) => {
      const d = 125 * Math.pow(row.motorOutput / row.motorRev, 1 / 3)
      const key = keyTable.find((row) => row.keyDiameterMin <= d + 10 && d + 10 <= row.keyDiameterMax)!
      const e1 = 1 - (0.2 * key.keyWidth) / d - (1.1 * key.keyDepth1) / d
      return { minDiameter: d / Math.pow(e1, 1 / 3) }
    })
    .select(diameterTable, (row) => {
      return row.minDiameter <= row.diameter
    })
    .select(keyTable, (row) => {
      return row.keyDiameterMin <= row.diameter && row.diameter <= row.keyDiameterMax
    })
    .append(["torque"], ["トルク"], (row) => {
      return { torque: (row.motorOutput * 1000) / (((2 * Math.PI) / 60) * row.motorRev) }
    })
    .append(["shearForce"], ["せん断力"], (row) => {
      return { shearForce: row.torque / (row.diameter / 1000 / 2) }
    })
    .append(["keyLength", "impellerBossLength"], ["キー長さ", "羽根車ボス長さ"], (row) => {
      const lkMin = row.shearForce / 10 / 71
      const lbMin = row.shearForce / (row.keyDepth2 - 0.3) / 62.5
      const keyLength = Math.ceil(Math.max(lkMin, lbMin) + 10)
      return {
        keyLength,
        impellerBossLength: keyLength + 8,
      }
    })
    .append(["impellerBossDiameterB", "impellerBossDiameterR"], ["羽根車ボス径Db", "羽根車ボス径Dr"], (row) => {
      const db = Math.ceil(
        2 * Math.sqrt(Math.pow(row.keyWidth / 2, 2) + Math.pow(row.diameter / 2 + row.keyDepth2, 2)) + 6,
      )
      const getExcess = (diameter: number) => {
        if (diameter < 25) return 5.5
        if (diameter < 50) return 7
        else return 9
      }

      const excess = Math.max(getExcess(row.diameter), (db - row.diameter + 1) / 2)
      return {
        impellerBossDiameterB: db,
        impellerBossDiameterR: row.diameter + 2 * excess,
      }
    })
    .select(impellerTable.reverse(), (row) => {
      return row.speedRatio > row.impellerSpeedRatio
    })
    .merge(newTable("羽根枚数", ["bladeCount"], ["羽根枚数"], [[5], [6], [7], [8]]))
    .append(["impellerEntranceOuterDiameter", "exitDiameter"], ["羽根車外径D2", "出口幅B2"], (row) => {
      const impellerQuantity = (1.05 * row.quantity) / 60

      const u2 = row.kU * Math.sqrt(2 * 9.8 * row.head)
      const vM2 = row.kM2 * Math.sqrt(2 * 9.8 * row.head)
      const d2 = Math.ceil((u2 / ((Math.PI / 60) * row.motorRev)) * 1000)
      const t2 = (Math.PI * d2) / row.bladeCount
      const s2 = 4 / Math.sin((22.5 * Math.PI) / 180)
      const b2 = Math.ceil((((impellerQuantity / (((Math.PI * d2) / 1000) * vM2)) * t2) / (t2 - s2)) * 1000)
      return {
        impellerEntranceOuterDiameter: d2,
        exitDiameter: b2,
      }
    })
    .append(["entranceHubDiameter"], ["入口ハブ径dh"], () => {
      return { entranceHubDiameter: 38 }
    })
    .append(["impellerEntranceSpeed", "eyeDiameter"], ["羽根車入口速度Vm1", "目玉径De"], (row) => {
      const vM1 = row.kM1 * Math.sqrt(2 * 9.8 * row.head)
      const ve = vM1 / 1.2
      const de = Math.sqrt(((4 / Math.PI) * 0.0292) / ve + Math.pow(row.entranceHubDiameter / 1000, 2)) * 1000
      return {
        impellerEntranceSpeed: vM1,
        eyeDiameter: Math.ceil(de),
      }
    })
    .append(["d1", "impellerEntranceAngle"], ["_D1", "羽根車入口角度b"], (row) => {
      const d1 = Math.ceil(row.eyeDiameter - 0.065 * (row.eyeDiameter - row.entranceHubDiameter))
      const u1 = (((Math.PI * d1) / 1000) * row.motorRev) / 60
      const b = (Math.atan((1.22 * row.impellerEntranceSpeed) / u1) * 180) / Math.PI
      return {
        d1,
        impellerEntranceAngle: b,
      }
    })
    .append(["impellerEntranceWidth"], ["羽根車入口幅B1"], (row) => {
      const t1 = (Math.PI * row.d1) / row.bladeCount
      const s1 = 2 / Math.sin((row.impellerEntranceAngle * Math.PI) / 180)

      const impellerQuantity = (1.05 * row.quantity) / 60
      const b1 =
        (((impellerQuantity / (((Math.PI * row.d1) / 1000) * row.impellerEntranceSpeed)) * t1) / (t1 - s1)) * 1000
      return {
        impellerEntranceWidth: b1,
      }
    })
    .filter((row) => {
      const z =
        ((6.5 * (row.impellerEntranceOuterDiameter + row.d1)) / (row.impellerEntranceOuterDiameter - row.d1)) *
        Math.sin(((row.impellerEntranceAngle + 22.5) * Math.PI) / 180 / 2)

      return Math.abs(z - row.bladeCount) < 2
    })

  return (
    <div>
      <div className={pageStyles.inputs}>
        <label className={pageStyles.label}>
          <span>流量</span>
          <input type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
        </label>
        <label className={pageStyles.label}>
          <span>全揚程</span>
          <input type="number" value={head} onChange={(e) => setHead(Number(e.target.value))} />
        </label>
        <label className={pageStyles.label}>
          <span>周波数</span>
          <input type="number" value={frequency} onChange={(e) => setFrequency(Number(e.target.value))} />
        </label>
      </div>
      <TableView table={data} />
    </div>
  )
}
