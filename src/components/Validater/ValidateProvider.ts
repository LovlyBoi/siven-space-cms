import { defineComponent, nextTick } from 'vue'

const ValidateProvider = defineComponent({
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
  template: '<slot />',
  provide() {
    return {
      mountValidateFuns: (fun: () => boolean) => {
        this.fns.push(fun)
      },
    }
  },
})

export default ValidateProvider
