<template>
	<div class="image-controls">
		<div class="controls-top">
			<button @click.stop="emitCommand('lock')">
				<img :src="keyIcon" :class="{ active: image.locked }">
			</button>
			<!-- другие кнопки -->
		</div>

		<div class="controls-bottom">
			<OpacityControl :opacity="image.opacity" @change="value => emitCommand('opacity', value)" />
			<LayerControl @command="cmd => emitCommand(cmd)" />
			<FiltersControl :filters="image.filters"
				@filter-change="(name, value) => emitCommand('filter', { name, value })" />
		</div>
	</div>
</template>

<script>
import FiltersControl from './FiltersControl.vue'
import LayerControl from './LayerControl.vue'
import OpacityControl from './OpacityControl.vue'

export default {
	components: { OpacityControl, LayerControl, FiltersControl },

	props: {
		image: Object
	},

	setup(_, { emit }) {
		const emitCommand = (command, value) => {
			emit('command', { command, value })
		}

		return { emitCommand }
	}
}
</script>