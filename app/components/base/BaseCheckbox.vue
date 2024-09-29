<script setup lang="ts">
const isChecked = defineModel<boolean>({ required: true, default: false })
</script>

<template>
	<label
		class="min-w-5 min-h-5 border rounded-[7px] group inline-flex items-center justify-center cursor-pointer transition-all duration-200 ease-in-out"
		:class="{
			'bg-primary border-primary': isChecked,
			'border-zinc-500': !isChecked,
		}"
	>
		<input
			type="checkbox"
			hidden
			:checked="isChecked"
		>
		<BaseIcon
			class="absolute"
			:class="{
				'group-hover:block hidden text-zinc-500': !isChecked,
				'block': isChecked,
			}"
			name="material-symbols-check-rounded"
			size="16"
		/>
	</label>
</template>
