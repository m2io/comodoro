<template>
	<ul class="text-xs text-zinc-500 flex flex-col gap-y-2">
		<li class="flex items-center gap-x-2 justify-between">
			<span><BaseKbd key-label="Space" /></span>
			<span>Start / Stop timer</span>
		</li>
		<li class="flex items-center gap-x-2 justify-between ">
			<span><BaseKbd key-label="meta" /> <BaseKbd key-label="," /></span>
			<span>open settings</span>
		</li>
		<li class="flex items-center gap-x-2 justify-between">
			<span><BaseKbd key-label="meta" /> <BaseKbd key-label="F" /></span>
			<span>focus todo input</span>
		</li>
		<li class="flex items-center gap-x-2 justify-between">
			<span><BaseKbd key-label="↑" /> <BaseKbd key-label="↓" /></span>
			<span>navigate between todos</span>
		</li>
		<li class="flex items-center gap-x-2 justify-between">
			<span><BaseKbd key-label="Enter" /></span>
			<span>toggle todo</span>
		</li>
		<li class="flex items-center gap-x-2 justify-between">
			<span><BaseKbd key-label="meta" /> <BaseKbd key-label="⌫" /></span>
			<span>delete todo</span>
		</li>

		<li class="flex items-center gap-x-2 justify-between">
			<span><BaseKbd key-label="Alt" /> <BaseKbd key-label="↑" /></span>
			<span>move todo up</span>
		</li>
		<li class="flex items-center gap-x-2 justify-between">
			<span><BaseKbd key-label="Alt" /> <BaseKbd key-label="↓" /></span>
			<span>move todo down</span>
		</li>
	</ul>
</template>
