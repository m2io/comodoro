<script setup lang="ts">
const {
	to,
	variant = 'primary',
	size = 'md',
	iconName = null,
	iconSize = '28',
} = defineProps<{
	variant?: 'primary' | 'secondary' | 'danger'
	size?: 'sm' | 'md' | 'lg'
	to?: string
	iconName?: keyof typeof ICONS
	iconSize?: string
}>()

const computedTag = computed(() => to ? resolveComponent('NuxtLink') : 'button')

const computedClass = computed(() => {
	const variantClass = {
		'bg-zinc-800 text-zinc-50 hover:bg-zinc-800/90 transition-colors border border-zinc-700/40': variant === 'primary',
		'bg-zinc-700 text-zinc-50 hover:bg-zinc-700/90 transition-colors border border-zinc-600/40': variant === 'secondary',
	}

	const buttonSizeClass = {
		'px-4 py-1.5 text-xs': size === 'sm',
		'px-6 py-2 text-sm': size === 'md',
		'px-8 py-2 text-lg': size === 'lg',
	}

	const iconSizeClass = {
		'size-7': size === 'sm',
		'size-9': size === 'md',
		'size-11': size === 'lg',
	}

	return {
		'flex items-center justify-center rounded-full font-semibold select-none': true,
		...variantClass,
		...(iconName ? iconSizeClass : buttonSizeClass),
	}
})
</script>

<template>
	<component
		:is="computedTag"
		:class="computedClass"
		:to="to"
	>
		<BaseIcon
			v-if="iconName"
			:name="iconName"
			:size="iconSize"
		/>
		<slot></slot>
	</component>
</template>
