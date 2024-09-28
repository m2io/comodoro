<script setup lang="ts">
const { label } = defineProps<{
	label?: string
}>()

const modelValue = defineModel<boolean>({ required: true })
</script>

<template>
	<label class="inline-flex cursor-pointer items-center">
		<input
			v-model="modelValue"
			type="checkbox"
			class="sr-only peer"
		>
		<div
			class="peer
			relative
			h-7
			w-14
			rounded-full
			border-zinc-600
			bg-zinc-700
			peer-checked:bg-primary
			peer-focus:outline-none
			after:absolute
			after:start-[4px]
			after:top-0.5
			after:h-6
			after:w-6
			after:rounded-full
			after:border
			after:border-zinc-400
			after:bg-white
			after:transition-all
			after:content-['']
			peer-checked:after:translate-x-full
			peer-checked:after:border-white"
		></div>
		<span class="ms-3 text-sm font-medium text-zinc-400">{{ label }}</span>
	</label>
</template>
