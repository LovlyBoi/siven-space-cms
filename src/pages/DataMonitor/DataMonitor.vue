<template>
  <div class="p-4">
    <NCard title="周访问量">
      <div id="weekly-pv-wrapper" style="height: 300px"></div>
    </NCard>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { NCard } from 'naive-ui'
import dayjs from '@/utils/day'
import { getPv } from '@/api'
import { pvArrFormater } from './utils'
import type { PvRecords } from '@/types'
import * as echarts from 'echarts/core'
import {
  BarChart,
  // 系列类型的定义后缀都为 SeriesOption
  BarSeriesOption,
  LineChart,
  LineSeriesOption,
} from 'echarts/charts'
import {
  TitleComponent,
  // 组件类型的定义后缀都为 ComponentOption
  TitleComponentOption,
  TooltipComponent,
  TooltipComponentOption,
  GridComponent,
  GridComponentOption,
  // 数据集组件
  DatasetComponent,
  DatasetComponentOption,
  // 内置数据转换器组件 (filter, sort)
  TransformComponent,
} from 'echarts/components'
import { LabelLayout, UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'

// 通过 ComposeOption 来组合出一个只有必须组件和图表的 Option 类型
type ECOption = echarts.ComposeOption<
  | BarSeriesOption
  | LineSeriesOption
  | TitleComponentOption
  | TooltipComponentOption
  | GridComponentOption
  | DatasetComponentOption
>

// 注册必须的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  BarChart,
  LineChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
])

const startDate = dayjs().subtract(6, 'day').format('YYYY-MM-DD')
const endDate = dayjs().format('YYYY-MM-DD')
let formatedRecords: PvRecords[] = []

let weeklyPvChartOptions: ECOption = {}
let weeklyPvChart: echarts.ECharts

getPv(startDate, endDate)
  .then((records) => {
    console.log(records)
    formatedRecords = pvArrFormater(records, startDate, endDate)
    console.log(formatedRecords)
    weeklyPvChartOptions = {
      xAxis: {
        type: 'category',
        data: formatedRecords.map((item) => dayjs(item.date).format('MM/DD')),
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: formatedRecords.map((item) => item.pv),
          type: 'line',
        },
      ],
      tooltip: {
        show: true,
      },
      color: ['#10B981', '#3B82F6', '#EC4899', '#F59E0B', '#EF4444'],
    }
    weeklyPvChart.setOption(weeklyPvChartOptions)
  })
  .catch((e) => {
    console.log(e)
  })

onMounted(() => {
  const weeklyPvWrapper = document.getElementById('weekly-pv-wrapper')
  if (!weeklyPvWrapper) return
  weeklyPvChart = echarts.init(weeklyPvWrapper)
  window.onresize = () => weeklyPvChart.resize()
})
</script>

<style scoped></style>
