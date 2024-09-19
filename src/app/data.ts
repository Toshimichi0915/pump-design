import { newTable } from "@/app/table"

export const motorTable = newTable(
  "同期回転数",
  ["motorPoles", "motorFreq", "motorRev"],
  ["極数", "周波数", "設計回転数"],
  [
    [2, 50, 2900],
    [2, 60, 3500],
    [4, 50, 1450],
    [4, 60, 1750],
    [6, 50, 960],
    [6, 60, 1170],
    [8, 50, 730],
    [8, 60, 870],
  ],
)

export const pumpEfficiencyTable = newTable(
  "ポンプ効率",
  ["pumpSpeedRatioMin", "pumpSpeedRatioMax", "pumpQuantity", "pumpEfficiency"],
  ["_最小比速度", "_最大比速度", "_ポンプ流量", "ポンプ効率"],
  [
    [140, 250, 0.1, 0.62],
    [140, 250, 1.0, 0.67],
    [140, 250, 2.0, 0.72],
    [140, 250, 4.0, 0.77],
    [140, 250, 6.0, 0.8],
    [250, 400, 0.1, 0.63],
    [250, 400, 1.0, 0.65],
    [250, 400, 2.0, 0.7],
    [250, 400, 4.0, 0.75],
    [250, 400, 6.0, 0.77],
    [400, 800, 0.1, 0.6],
    [400, 800, 1.0, 0.63],
    [400, 800, 2.0, 0.68],
    [400, 800, 4.0, 0.7],
    [400, 800, 6.0, 0.72],
  ],
)

export const motorOutputTable = newTable(
  "電動機出力",
  ["motorOutput"],
  ["電動機出力"],
  [
    [0.75],
    [1.1],
    [1.5],
    [2.2],
    [2.7],
    [3.7],
    [5.5],
    [7.5],
    [11],
    [15],
    [18.5],
    [22],
    [30],
    [37],
    [45],
    [55],
    [75],
    [90],
    [110],
  ],
)

export const keyTable = newTable(
  "キー",
  ["keyWidth", "keyHeight", "keyDepth1", "keyDepth2", "keyDiameterMin", "keyDiameterMax"],
  ["キー幅", "キー高さ", "キー深さ1", "キー深さ2", "_キー軸端最小径", "_キー軸端最大径"],
  [
    [2, 2, 1.2, 1.0, 6, 8],
    [3, 3, 1.8, 1.4, 8, 10],
    [4, 4, 2.5, 1.8, 10, 12],
    [5, 5, 3.0, 2.3, 12, 17],
    [6, 6, 3.5, 2.8, 17, 22],
    // [7, 7, 4.0, 3.3, 20, 25],
    [8, 7, 4.0, 3.3, 22, 30],
    [10, 8, 5.0, 3.3, 30, 38],
    [12, 8, 5.0, 3.3, 38, 44],
    [14, 9, 5.5, 3.8, 44, 50],
    // [15, 10, 5.0, 5.3, 50, 55],
    [16, 10, 6.0, 4.3, 50, 58],
    [18, 11, 7.0, 4.4, 58, 65],
    [20, 12, 7.5, 4.9, 65, 75],
    [22, 14, 9.0, 5.4, 75, 85],
    // [24, 16, 8.0, 8.4, 80, 90],
    [25, 14, 9.0, 5.4, 85, 95],
    [28, 16, 10.0, 6.4, 95, 110],
    [32, 18, 11.0, 7.4, 110, 130],
    // [35, 22, 11.0, 11.4, 125, 140],
    [36, 20, 12.0, 8.4, 130, 150],
    [38, 24, 12.0, 12.4, 140, 160],
    [40, 22, 13.0, 9.4, 150, 170],
    [42, 26, 13.0, 13.4, 160, 180],
    [45, 25, 15.0, 10.4, 170, 200],
    [50, 28, 17.0, 11.4, 200, 230],
    [56, 32, 20.0, 12.4, 230, 260],
    [63, 36, 20.0, 12.4, 260, 290],
    [70, 36, 22.0, 14.4, 290, 330],
    [80, 40, 25.0, 15.4, 330, 380],
    [90, 45, 28.0, 17.4, 380, 440],
    [100, 50, 31.0, 19.5, 440, 500],
  ],
)

export const diameterTable = newTable(
  "軸径",
  ["diameter"],
  ["軸径"],
  [
    [6],
    [7],
    [8],
    [9],
    [10],
    [11],
    [12],
    [14],
    [16],
    [18],
    [19],
    [20],
    [22],
    [24],
    [25],
    [28],
    [30],
    [32],
    [35],
    [38],
    [40],
    [42],
    [45],
    [48],
    [50],
    [55],
    [56],
    [60],
    [63],
    [65],
    [70],
    [71],
    [75],
    [80],
    [85],
    [90],
    [95],
  ],
)

export const impellerTable = newTable(
  "羽根車",
  ["impellerSpeedRatio", "kM1", "kM2", "kU", "kV"],
  ["比速度", "Km1", "Km2", "Ku", "Kv"],
  [
    [100, 0.12, 0.08, 0.93, 0.5],
    [140, 0.13, 0.115, 0.95, 0.48],
    [150, 0.14, 0.12, 0.95, 0.45],
    [200, 0.16, 0.125, 0.97, 0.4],
    [250, 0.17, 0.13, 0.1, 0.38],
    [300, 0.18, 0.15, 0.12, 0.34],
  ],
)
