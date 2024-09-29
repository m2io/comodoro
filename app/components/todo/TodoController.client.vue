<script setup lang="ts">
import { useIDBKeyval } from '@vueuse/integrations/useIDBKeyval'

interface Todo {
	text: string
	done: boolean
}

const { data: todos } = useIDBKeyval<Todo[]>('todos', [])

const todoListEl = ref<HTMLElement>()
const inputEl = ref<HTMLInputElement>()
const editFormEl = ref<HTMLFormElement>()
const contextMenuEl = ref<HTMLElement>()

const focusedItemIndex = ref(-1)
const inputFocused = ref(false)
const newTodo = ref('')
const currentlyEditableTodoIndex = ref(-1)
const editTodoText = ref('')
const contextMenuIndex = ref(-1)
const contextMenuVisible = ref(false)
const contextMenuCords = ref({ x: 0, y: 0 })

function addTodo() {
	if (!newTodo.value)
		return
	todos.value.push({ text: newTodo.value, done: false })
	newTodo.value = ''
}

function editTodo(index: number) {
	if (!todos.value[index]) {
		return
	}

	currentlyEditableTodoIndex.value = index
	editTodoText.value = todos.value[index].text

	nextTick(() => {
		const inputEl = document.querySelector(`[data-index="${index}"] input`) as HTMLInputElement
		inputEl?.focus()
		inputEl?.select()
	})

	if (contextMenuVisible.value) {
		contextMenuVisible.value = false
		contextMenuIndex.value = -1
	}
}

function updateTodoWithText(index: number, text: string) {
	if (!todos.value[index]) {
		return
	}

	todos.value[index].text = text
	currentlyEditableTodoIndex.value = -1
	editTodoText.value = ''
}

function deleteTodo(index: number) {
	if (contextMenuVisible.value) {
		contextMenuVisible.value = false
		contextMenuIndex.value = -1
	}

	todos.value.splice(index, 1)

	if (focusedItemIndex.value === index && focusedItemIndex.value > 0) {
		focusedItemIndex.value--
	}
}

function checkTodo(index: number) {
	if (!todos.value[index]) {
		return
	}

	todos.value[index].done = !todos.value[index].done
}

watch(() => inputFocused.value, (isFocused) => {
	if (isFocused) {
		inputEl.value?.focus()
	} else {
		inputEl.value?.blur()
	}
})

function onInputFocus() {
	inputFocused.value = true
}

function onInputBlur() {
	inputFocused.value = false
}

function moveItem(index: number, direction: 'up' | 'down') {
	if (todos.value.length < 2) {
		return
	}

	const lastIndex = todos.value.length - 1

	if (direction === 'up' && index > 0) {
		const newIndex = index === 1 ? 0 : index - 1
		const temp = todos.value[newIndex]
		todos.value[newIndex] = todos.value[index]!
		todos.value[index] = temp!
		focusedItemIndex.value = newIndex
	} else if (direction === 'down' && index < lastIndex) {
		const newIndex = index === lastIndex - 1 ? lastIndex : index + 1
		const temp = todos.value[newIndex]
		todos.value[newIndex] = todos.value[index]!
		todos.value[index] = temp!
		focusedItemIndex.value = newIndex
	}
}

useMagicKeys({
	passive: false,
	onEventFired(e) {
		if (e.metaKey && e.key === 'f' && e.type === 'keydown') {
			e.preventDefault()
			inputEl.value?.focus()
			focusedItemIndex.value = -1
			return
		}

		if (e.key === 'Enter' && e.type === 'keydown' && currentlyEditableTodoIndex.value === -1 && focusedItemIndex.value !== -1) {
			checkTodo(focusedItemIndex.value)
			return
		}

		if (e.metaKey && e.key === 'e' && e.type === 'keydown' && currentlyEditableTodoIndex.value === -1 && focusedItemIndex.value !== -1) {
			editTodo(focusedItemIndex.value)
			return
		}

		if (e.metaKey && e.key === 'Backspace' && e.type === 'keydown' && currentlyEditableTodoIndex.value === -1 && focusedItemIndex.value !== -1) {
			deleteTodo(focusedItemIndex.value)
			return
		}

		if (e.key === 'Escape' && e.type === 'keydown') {
			e.preventDefault()
			contextMenuVisible.value = false
			contextMenuIndex.value = -1
			currentlyEditableTodoIndex.value = -1
		}

		// on alt and arrow up and down move item
		if (e.altKey && e.type === 'keydown' && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
			e.preventDefault()
			moveItem(focusedItemIndex.value, e.key === 'ArrowUp' ? 'up' : 'down')
			return
		}

		if (e.type === 'keydown' && (e.key === 'ArrowUp' || e.key === 'ArrowDown') && currentlyEditableTodoIndex.value === -1) {
			e.preventDefault()

			if (e.key === 'ArrowUp' && focusedItemIndex.value > -1) {
				focusedItemIndex.value--
			} else if (e.key === 'ArrowDown' && focusedItemIndex.value < todos.value.length - 1) {
				if (inputFocused.value) {
					onInputBlur()
				}
				focusedItemIndex.value++
			}

			if (e.key === 'ArrowUp' && focusedItemIndex.value === -1) {
				inputEl.value?.focus()
			}
		}
	},
})

function onMouseOver(index: number) {
	if (contextMenuVisible.value) {
		return
	}
	focusedItemIndex.value = index
}

function onMouseOut() {
	focusedItemIndex.value = -1
}

onClickOutside(todoListEl, () => {
	focusedItemIndex.value = -1
})

onClickOutside(editFormEl, () => {
	currentlyEditableTodoIndex.value = -1
	editTodoText.value = ''
})

onClickOutside(contextMenuEl, () => {
	contextMenuVisible.value = false
	contextMenuIndex.value = -1
})

function onRightClick(e: MouseEvent, index: number) {
	contextMenuVisible.value = true
	contextMenuIndex.value = index
	contextMenuCords.value = { x: e.clientX, y: e.clientY }
}
</script>

<template>
	<section>
		<form @submit.prevent="addTodo">
			<input
				ref="inputEl"
				v-model="newTodo"
				type="text"
				class="rounded-full border-zinc-700 text-zinc-200 border px-5 py-2 w-full"
				placeholder="What needs to be done?"
				@focus="onInputFocus"
				@blur="onInputBlur"
			>
		</form>
		<div class="flex justify-between items-center mt-8 text-sm text-zinc-400 border-b border-zinc-700 pb-1 mx-2">
			<span>Todos</span>
		</div>
		<ul
			v-if="todos.length > 0"
			ref="todoListEl"
			class="flex flex-col mt-1"
		>
			<li
				v-for="(todo, index) in todos"
				:key="todo.text"
				:data-active="focusedItemIndex === index || currentlyEditableTodoIndex === index || contextMenuIndex === index"
				:data-index="index"
				class="group flex cursor-pointer items-center justify-between rounded-lg py-2 px-3 select-none data-[active=true]:bg-zinc-800"
				:class="{ 'blur-sm': currentlyEditableTodoIndex !== -1 && currentlyEditableTodoIndex !== index }"
				@mouseover="onMouseOver(index)"
				@contextmenu.prevent="onRightClick($event, index)"
				@mouseout="onMouseOut"
				@click="checkTodo(index)"
				@keyup.enter.prevent="checkTodo(index)"
			>
				<div class="flex items-center flex-1">
					<div
						v-if="currentlyEditableTodoIndex !== index"
						class="flex items-center gap-x-6"
					>
						<BaseCheckbox
							v-model="todo.done"
							class="pointer-events-none"
						/>
						<span
							class="text-zinc-200 text-lg relative"
							:class="{ 'text-zinc-500 ': todo.done }"
						>
							{{ todo.text }}
						</span>
					</div>

					<form
						v-else
						ref="editFormEl"
						class="w-full"
						@submit.prevent="updateTodoWithText(index, editTodoText)"
					>
						<input
							v-model="editTodoText"
							type="text"
							class="focus-visible:outline-none border-none w-full"
						/>
					</form>
				</div>
			</li>
		</ul>

		<div
			v-if="contextMenuVisible"
			ref="contextMenuEl"
			class="fixed flex flex-col rounded-lg border border-zinc-700/80 bg-zinc-800/80 p-1 text-zinc-200 shadow-lg backdrop-blur-sm"
			:style="{ top: `${contextMenuCords.y}px`, left: `${contextMenuCords.x}px` }"
		>
			<button
				class="text-zinc-400 flex cursor-pointer items-center gap-x-2 rounded py-1 px-2 hover:bg-zinc-700 hover:text-zinc-200 text-sm"
				@click="editTodo(contextMenuIndex)"
			>
				<BaseIcon name="material-symbols-light-edit-rounded" /> Rephrase
			</button>
			<button
				class="text-zinc-400 flex cursor-pointer items-center gap-x-2 rounded py-1 px-2 hover:bg-zinc-700 hover:text-zinc-200 text-sm"
				@click="deleteTodo(contextMenuIndex)"
			>
				<BaseIcon name="material-symbols-light-delete-outline-rounded" />
				Delete
			</button>
		</div>
	</section>
</template>
