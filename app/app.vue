<script setup lang="ts">
const MIN_WIDTH = 270
const MAX_WIDTH = 420

const settings = useSettings()
const layoutEl = shallowRef<HTMLElement | null>(null)
const currentWidth = ref(`${MIN_WIDTH}px`)
const isResizing = ref(false)

function startResize(e: MouseEvent) {
	if (!e.target)
		return

	isResizing.value = true
	document.body.classList.add('cursor-col-resize')
	document.addEventListener('mousemove', resize)
}

function stopResize() {
	isResizing.value = false
	document.body.classList.remove('cursor-col-resize')
	document.removeEventListener('mousemove', resize)
}

function resize(e: MouseEvent) {
	if (!layoutEl.value)
		return

	const layoutRect = layoutEl.value.getBoundingClientRect()
	const newWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, layoutRect.right - e.clientX))
	currentWidth.value = `${newWidth}px`
}

onMounted(() => {
	document.addEventListener('mouseup', stopResize)
})

onUnmounted(() => {
	document.removeEventListener('mousemove', resize)
	document.removeEventListener('mouseup', stopResize)
})

const showModal = ref(false)

useMagicKeys({
	passive: false,
	onEventFired(e) {
		if (e.metaKey && e.key === ',' && e.type === 'keydown') {
			e.preventDefault()
			showModal.value = true
			return
		}

		if (e.key === 'Escape' && e.type === 'keydown' && showModal.value) {
			e.preventDefault()
			showModal.value = false
		}
	},
})

if (import.meta.client) {
	settings.userAgent = detectUserAgent()
}
</script>

<template>
	<NuxtRouteAnnouncer />
	<SvgSprite />
	<div
		id="default-layout"
		ref="layoutEl"
		class="grid h-full w-full grid-rows-[1fr] overflow-hidden"
	>
		<main class="md:my-2 md:ml-2 flex flex-col rounded-xl border border-zinc-900 bg-zinc-925 order-1 md:order-none overflow-y-scroll">
			<article class="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-y-16 p-4">
				<TimeController />
				<TodoController />
			</article>
		</main>
		<div
			class="relative group -left-2 my-5 w-4 z-50 cursor-col-resize hidden md:block"
			@mousedown="startResize"
		>
			<div
				class="mx-auto h-full w-[1px] rounded-full transition duration-500 ease-out group-hover:bg-zinc-600"
				:class="{ 'bg-zinc-600': isResizing }"
			>
			</div>
		</div>
		<aside class="flex flex-col pt-2 px-4 pb-2 order-2 md:order-none">
			<div class="mt-auto ">
				<ClientOnly>
					<SiteShortcuts />
				</ClientOnly>
				<BaseButton
					class="mt-8 w-full"
					size="md"
					@click="showModal = true"
				>
					Settings
				</BaseButton>
				<p class="text-xs text-zinc-700 mt-4">
					Comodoro &copy; 2024
				</p>
			</div>
		</aside>
		<LazyBaseModal v-model="showModal">
			<SiteSettings />
		</LazyBaseModal>
	</div>
</template>

<style scoped>
@media (min-width: 768px) {
	#default-layout {
		grid-template-columns: auto 1px v-bind(currentWidth);
	}
}
</style>
