<script setup lang="ts">
const { keyLabel } = defineProps<{
	keyLabel: string
}>()

const settings = useSettings()

const computedMetaSymbol = computed(() => {
	if (settings.userAgent.isMac) {
		return '⌘'
	}

	return 'CTRL'
})
const isSquare = computed(() => {
	return keyLabel.length === 1 || (keyLabel === 'meta' && settings.userAgent.isMac)
})
</script>

<template>
	<kbd
		class="bg-zinc-900 border font-geist border-zinc-800/20 text-zinc-300 rounded h-5 px-2 text-[12px] inline-flex items-center justify-center"
		:class="{ 'size-5': isSquare }"
	>
		<template v-if="keyLabel === 'meta'">{{ computedMetaSymbol }}</template>
		<template v-else>{{ keyLabel }}</template>
	</kbd>
</template>
