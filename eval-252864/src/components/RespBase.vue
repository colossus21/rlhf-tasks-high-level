<template>
  <BaseEdge :id="id" :style="style" :path="customPath" :marker-end="markerEnd" />
  <EdgeLabelRenderer>
    <div
        :style="{
        pointerEvents: 'all',
        position: 'absolute',
        transform: `translate(-50%, -50%) translate(${labelPosition.x}px,${labelPosition.y}px)`,
        cursor: isDragging ? 'grabbing' : 'grab'
      }"
        class="nodrag nopan"
        @pointerdown="onDragStart"
        @pointermove="onDrag"
        @pointerup="onDragEnd"
    >
      <div :class="'border-primary-dark border p-1 bg-white'">
        <LabelIcon v-if="id !== 'connect'" :class="'size-4'" />
      </div>
    </div>
  </EdgeLabelRenderer>
</template>

<script>
import { BaseEdge, EdgeLabelRenderer } from '@vue-flow/core'
import { computed, ref, onMounted, defineComponent } from 'vue'

export default defineComponent({
  props: {
    id: { type: String, required: true },
    sourceX: { type: Number, required: true },
    sourceY: { type: Number, required: true },
    targetX: { type: Number, required: true },
    targetY: { type: Number, required: true },
    sourcePosition: { type: String, required: true },
    targetPosition: { type: String, required: true },
    markerEnd: { type: String, required: false },
    style: { type: Object, required: false },
    type: { type: String, required: false },
    updatable: { type: Boolean, required: false }
  },
  setup(props) {
    const labelOffset = ref({ x: 0, y: 0 })
    const isDragging = ref(false)
    const startPosition = ref({ x: 0, y: 0 })

    const calculateControlPoints = () => {
      const { sourceX, sourceY, targetX, targetY } = props
      const deltaX = targetX - sourceX
      const deltaY = targetY - sourceY

      const midX = sourceX + deltaX / 2
      const midY = sourceY + deltaY / 2

      const adjustedMidX = midX + labelOffset.value.x
      const adjustedMidY = midY + labelOffset.value.y

      return {
        sourceControl: { x: adjustedMidX, y: sourceY },
        targetControl: { x: adjustedMidX, y: targetY },
        midPoint: { x: adjustedMidX, y: adjustedMidY }
      }
    }

    const customPath = computed(() => {
      const { sourceX, sourceY, targetX, targetY } = props
      const { sourceControl, targetControl } = calculateControlPoints()
      return `M ${sourceX} ${sourceY} L ${sourceControl.x} ${sourceY} L ${sourceControl.x} ${targetControl.y} L ${targetX} ${targetY}`
    })

    const labelPosition = computed(() => {
      const { midPoint } = calculateControlPoints()
      return { x: midPoint.x, y: midPoint.y }
    })

    const onDragStart = (event) => {
      isDragging.value = true
      startPosition.value = {
        x: event.clientX - labelOffset.value.x,
        y: event.clientY - labelOffset.value.y
      }
      event.target.setPointerCapture(event.pointerId)
    }

    const onDrag = (event) => {
      if (!isDragging.value) return
      labelOffset.value = {
        x: event.clientX - startPosition.value.x,
        y: event.clientY - startPosition.value.y
      }
    }

    const onDragEnd = (event) => {
      isDragging.value = false
      event.target.releasePointerCapture(event.pointerId)
    }

    onMounted(() => {
      document.addEventListener('pointerup', () => {
        isDragging.value = false
      })
    })

    return {
      customPath,
      labelPosition,
      onDragStart,
      onDrag,
      onDragEnd,
      isDragging
    }
  }
})
</script>

<style scoped>
.nodrag {
  user-select: none;
}
.nopan {
  pointer-events: none;
}
</style>
