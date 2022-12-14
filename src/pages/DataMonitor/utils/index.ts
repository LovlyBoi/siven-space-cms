import dayjs from '@/utils/day'
import { PvRecords } from '@/types'

export function pvArrFormater(
  records: PvRecords[],
  start: string,
  end: string
) {
  const ret: PvRecords[] = []
  const startDate = dayjs(start)
  const endDate = dayjs(end)
  let pointer = startDate.clone()
  console.log(startDate.format('DD'), 'start')
  console.log(endDate.format('DD'), 'end')
  while (!pointer.isAfter(endDate)) {
    const tempDate = pointer.format('YYYY-M-DD')
    console.log(tempDate)
    const idx = records.findIndex((item) => dayjs(item.date).isSame(pointer))
    ret.push(
      idx < 0
        ? {
            date: tempDate,
            pv: 0,
          }
        : records[idx]
    )
    pointer = pointer.add(1, 'day')
  }
  return ret
}
