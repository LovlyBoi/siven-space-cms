<template>
  <div class="p-4">
    <NSpace vertical>
      <NCard title="过去一周的网站访问量">
        <div id="weekly-pv-wrapper" style="height: 300px"></div>
      </NCard>
      <NCard title="博客访问量 Top10">
        <div id="top-n-blogs-wrapper" style="height: 300px"></div>
      </NCard>
    </NSpace>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { NCard, NSpace } from 'naive-ui'
import dayjs from '@/utils/day'
import { getPv, getTopNBlogs } from '@/api'
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

const chartColor = ['#10B981', '#3B82F6', '#EC4899', '#F59E0B', '#EF4444']

const startDate = dayjs().subtract(7, 'day').format('YYYY-MM-DD')
const endDate = dayjs().subtract(1, 'day').format('YYYY-MM-DD')
let formatedPvRecords: PvRecords[] = []

let weeklyPvChartOptions: ECOption = {}
let weeklyPvChart: echarts.ECharts

let topNBlogsChartOptions: ECOption = {}
let topNBlogsChart: echarts.ECharts

getPv(startDate, endDate)
  .then((records) => {
    formatedPvRecords = pvArrFormater(records, startDate, endDate)
    weeklyPvChartOptions = {
      xAxis: {
        type: 'category',
        data: formatedPvRecords.map((item) => dayjs(item.date).format('MM/DD')),
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: formatedPvRecords.map((item) => item.pv),
          type: 'line',
        },
      ],
      tooltip: {
        show: true,
      },
      color: chartColor,
    }
    weeklyPvChart.setOption(weeklyPvChartOptions)
  })
  .catch((e) => {
    console.log(e)
  })

getTopNBlogs(5)
  .then((blogs) => {
    topNBlogsChartOptions = {
      xAxis: {
        data: blogs.map((blog) => blog.title),
        axisLabel: {
          formatter(value: string, index: number) {
            const maxLen = 5
            return value.length < maxLen
              ? value
              : value.slice(0, maxLen) + '...'
          },
        },
      },
      yAxis: {},
      series: [
        {
          type: 'bar',
          data: blogs.map((blog) => blog.readingVolume),
        },
      ],
      tooltip: {
        show: true,
      },
      color: chartColor,
    }
    topNBlogsChart.setOption(topNBlogsChartOptions)
  })
  .catch((e) => {
    console.log(e)
  })

onMounted(() => {
  const weeklyPvWrapper = document.getElementById('weekly-pv-wrapper')
  const topNBlogsWrapper = document.getElementById('top-n-blogs-wrapper')
  if (!weeklyPvWrapper) return
  weeklyPvChart = echarts.init(weeklyPvWrapper)
  window.addEventListener('resize', () => weeklyPvChart.resize())
  if (!topNBlogsWrapper) return
  topNBlogsChart = echarts.init(topNBlogsWrapper)
  window.addEventListener('resize', () => topNBlogsChart.resize())
})
</script>

<style scoped></style>
