<script lang="ts">
import {
  ref,
  defineComponent,
  h,
  PropType,
  inject,
  mergeProps,
  computed,
  nextTick,
  ComponentPublicInstance,
} from 'vue'
import './index.css'

type validateInfo = {
  isValid: boolean
  msg?: string
}

export type ValidateInputInstance = ComponentPublicInstance<
  Record<string, never>,
  { validate(): boolean; shake(): void }
>

export default defineComponent({
  props: {
    modelValue: String,
    modelModifiers: {
      type: Object as PropType<{ trim?: true }>,
      default: () => ({}),
    },
    rule: {
      type: Function as PropType<
        ((value: string) => boolean) | ((value: string) => validateInfo)
      >,
      default: () => true,
    },
    trigger: {
      type: String as PropType<'input' | 'blur'>,
      default: 'input',
    },
    animation: {
      type: Boolean as PropType<boolean>,
      default: true,
    },
    animateOnInvalid: {
      type: Boolean as PropType<boolean>,
      default: true,
    },
    normalClass: {
      type: String as PropType<string>,
      required: true,
    },
    errorClass: {
      type: String as PropType<string>,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  inheritAttrs: false,
  setup(props, { attrs, emit, expose }) {
    const isValid = ref(true)
    const errorMsg = ref('')

    const inputRef = ref<HTMLInputElement>()

    let timerId: string | number

    function animationTrigger() {
      clearTimeout(timerId)
      inputRef.value?.classList.remove('shake')
      if (!props.animation || !inputRef.value) return
      inputRef.value.classList.add('shake')
      timerId = setTimeout(() => {
        inputRef.value?.classList.remove('shake')
      }, 500) as unknown as string | number
    }

    function validInputValue() {
      const el = inputRef.value
      if (!el) return false
      let isOk: boolean, msg: string
      const result = props.rule?.(el.value)
      if (typeof result === 'boolean') {
        isOk = result
        msg = isOk ? '' : '格式错误'
      } else {
        isOk = result.isValid
        msg = isOk ? '' : result.msg || '格式错误'
      }
      isValid.value = isOk
      errorMsg.value = msg
      if (props.animateOnInvalid && !isOk) {
        nextTick(() => {
          animationTrigger()
        })
      }
      return isOk
    }

    const mountValidateFuns =
      inject<(...args: any[]) => boolean>('mountValidateFuns')

    mountValidateFuns?.(validInputValue)

    const value = computed({
      get() {
        return props.modelValue
      },
      set(newValue) {
        const {
          modelModifiers: { trim },
        } = props
        newValue = trim ? newValue?.trim() : newValue
        emit('update:modelValue', newValue)
      },
    })

    expose({
      validate: validInputValue,
      shake: animationTrigger,
    })

    return () =>
      h('div', { class: 'relative' }, [
        h(
          'input',
          mergeProps(attrs, {
            ref: (el) => {
              inputRef.value = el as HTMLInputElement
            },
            value: value.value,
            onInput: [
              (e: Event) => {
                value.value = (e.target as HTMLInputElement).value
              },
              props.trigger === 'input' ? validInputValue : undefined,
            ],
            onChange: [
              props.modelModifiers.trim
                ? (e: Event) => {
                    const el = e.target as HTMLInputElement
                    el.value = el.value.trim()
                  }
                : undefined,
            ],
            onBlur: [props.trigger === 'blur' ? validInputValue : undefined],
            class: [isValid.value ? props.normalClass : props.errorClass],
          }),
          []
        ),
        isValid.value
          ? undefined
          : h(
              'p',
              {
                class:
                  'absolute w-[400px] h-6 left-full top-0 text-red-600 pl-3 py-[6px]',
              },
              errorMsg.value
            ),
      ])
  },
})
</script>
