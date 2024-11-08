<script setup>
import { BaseEdge, EdgeLabelRenderer } from '@vue-flow/core'
import { computed, reactive, watch } from 'vue'

// Define props as in your code
const props = defineProps({
  id: String,
  sourceX: Number,
  sourceY: Number,
  targetX: Number,
  targetY: Number,
  sourcePosition: String,
  targetPosition: String,
  markerEnd: String,
  style: Object,
  type: String,
  updatable: Boolean
})

// Set up reactive state for label coordinates (initially halfway between source and target)
const labelPosition = reactive({
  x: (props.sourceX + props.targetX) / 2,
  y: (props.sourceY + props.targetY) / 2,
})

// Update path when label position or edge points change
const path = computed(() => {
  const startX = props.sourceX
  const startY = props.sourceY
  const endX = props.targetX
  const endY = props.targetY

  // Adjust points based on label position
  return `M${startX},${startY} L${labelPosition.x},${labelPosition.y} L${endX},${endY}`
})

// Update label position and path on drag
function handleLabelDrag(event) {
  labelPosition.x += event.movementX
  labelPosition.y += event.movementY
}

</script>

<template>
  <BaseEdge :id="id" :style="style" :path="path" :marker-end="markerEnd" />
  <EdgeLabelRenderer>
    <div
        @mousedown.prevent="startDragging"
        :style="{
        pointerEvents: 'all',
        position: 'absolute',
        transform: `translate(-50%, -50%) translate(${labelPosition.x}px, ${labelPosition.y}px)`
      }"
        class="nodrag nopan"
    >
      <div class="border-primary-dark border p-1 bg-white">
        <LabelIcon v-if="props.id !== 'connect'" class="size-4 cursor-pointer" />
      </div>
    </div>
  </EdgeLabelRenderer>
</template>

<script>
import { onMounted, onUnmounted } from 'vue'

export default {
  methods: {
    startDragging(event) {
      document.addEventListener('mousemove', this.handleLabelDrag)
      document.addEventListener('mouseup', this.stopDragging)
    },
    stopDragging() {
      document.removeEventListener('mousemove', this.handleLabelDrag)
      document.removeEventListener('mouseup', this.stopDragging)
    }
  },
  unmounted() {
    // Clean up event listeners when component is destroyed
    document.removeEventListener('mousemove', this.handleLabelDrag)
    document.removeEventListener('mouseup', this.stopDragging)
  }
}
</script>