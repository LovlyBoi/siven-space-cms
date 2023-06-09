<template>
  <slot />
</template>

<script lang="ts">
import { defineComponent, nextTick } from 'vue'

export default defineComponent({
  name: 'ValidateProvider',
  setup(_, { expose }) {
    const fns: (() => boolean)[] = []

    async function validateAll() {
      const result = fns.reduce((acc, fn) => fn() && acc, true)
      await nextTick()
      return result
    }

    expose({ validateAll })

    return {
      fns,
      validateAll,
    }
  },
  // render() {
  //   reutrn () => h(Slot)
  // },
  provide() {
    return {
      mountValidateFuns: (fun: () => boolean) => {
        this.fns.push(fun)
      },
    }
  },
})
</script>
