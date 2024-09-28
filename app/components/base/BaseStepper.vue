<script setup lang="ts">
const {
	steps = 0.1,
	min = 0,
	max = null,
	label = null,
	displayValue = null,
	disabled = false,
} = defineProps<{
	steps?: number
	min?: number
	max?: number
	label?: string
	displayValue?: string | number
	disabled?: boolean
}>()

const modelValue = defineModel<number>({ required: true })

const currentInterval = ref<NodeJS.Timeout>()
const currentTimeout = ref<NodeJS.Timeout>()
const increaseStepTimeout = ref<NodeJS.Timeout>()
const useIncreasedStep = ref(false)

const initialTouchStart = ref({ x: 0, y: 0 })

function onInteractionEnd() {
	clearInterval(currentInterval.value)
	clearTimeout(currentTimeout.value)
	clearTimeout(increaseStepTimeout.value)
	useIncreasedStep.value = false
}

const stepFactor = computed(() => {
	return useIncreasedStep.value ? 2 : 1
})

function increaseValue() {
	if (max && modelValue.value! >= max)
		return

	const newValue = (modelValue.value as number) + (steps * stepFactor.value)

	modelValue.value = Number.parseFloat(newValue.toFixed(2))
}

function decreaseValue() {
	if (modelValue.value! <= min)
		return

	const newValue = (modelValue.value as number) - (steps * stepFactor.value)

	modelValue.value = Number.parseFloat(newValue.toFixed(2))
}

function onInteractionStart(event: MouseEvent | TouchEvent, type: string) {
	if (event instanceof MouseEvent) {
		initialTouchStart.value = {
			x: event.clientX,
			y: event.clientY,
		}
	} else {
		initialTouchStart.value = {
			x: event.touches?.[0]?.clientX || 0,
			y: event.touches?.[0]?.clientY || 0,
		}
	}

	increaseStepTimeout.value = setTimeout(() => {
		useIncreasedStep.value = true
	}, 2000)

	currentTimeout.value = setTimeout(() => {
		currentInterval.value = setInterval(() => {
			if (type === 'plus') {
				increaseValue()
			} else {
				decreaseValue()
			}
		}, 75)
	}, 300)
}

function onTouchMove(event: MouseEvent | TouchEvent) {
	let clientX = 0
	let clientY = 0
	if (event instanceof MouseEvent) {
		clientX = event.clientX
		clientY = event.clientY
	} else {
		clientX = event.touches?.[0]?.clientX || 0
		clientY = event.touches?.[0]?.clientY || 0
	}

	const xDiff = Math.abs(initialTouchStart.value.x - clientX)
	const yDiff = Math.abs(initialTouchStart.value.y - clientY)

	if (xDiff > 100 || yDiff > 100) {
		onInteractionEnd()
	}
}
</script>

<template>
	<div
		class="w-full select-none"
		:class="{
			'opacity-20': disabled,
		}"
	>
		<label class="mb-4 inline-block w-full text-center text-sm font-semibold text-zinc-400">
			{{ label }}
		</label>

		<div class="flex items-center justify-between">
			<BaseButton
				type="button"
				size="md"
				icon-size="24"
				variant="secondary"
				:disabled="disabled || modelValue <= min"
				icon-name="material-symbols-remove-rounded"
				@mousedown="onInteractionStart($event, 'minus')"
				@mouseup="onInteractionEnd"
				@touchstart.stop.passive="onInteractionStart($event, 'minus')"
				@touchend="onInteractionEnd"
				@touchmove.stop.passive="onTouchMove"
				@click="decreaseValue"
			/>
			<div class="flex flex-1 select-none flex-col text-center tabular-nums">
				<span class="text-3xl font-semibold">
					{{ displayValue ? displayValue : modelValue }}
				</span>
			</div>
			<BaseButton
				type="button"
				size="md"
				icon-size="24"
				variant="secondary"
				:disabled="disabled || !!(max && modelValue >= max)"
				icon-name="material-symbols-add-rounded"
				@mousedown="onInteractionStart($event, 'plus')"
				@mouseup="onInteractionEnd"
				@touchstart.stop.passive="onInteractionStart($event, 'plus')"
				@touchend="onInteractionEnd"
				@touchmove.stop.passive="onTouchMove"
				@click="increaseValue"
			/>
		</div>
	</div>
</template>
