<script setup>
import { BaseEdge, EdgeLabelRenderer } from '@vue-flow/core'
import { computed, ref, watch } from 'vue'

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  sourceX: {
    type: Number,
    required: true
  },
  sourceY: {
    type: Number,
    required: true
  },
  targetX: {
    type: Number,
    required: true
  },
  targetY: {
    type: Number,
    required: true
  },
  // ... other props
  sourcePosition: { type: String, required: true },
  targetPosition: { type: String, required: true },
  markerEnd: { type: String, required: false },
  style: { type: Object, required: false },
  type: { type: String, required: false },
  updatable: { type: Boolean, required: false }
})

const labelPosition = ref({ x: 0, y: 0 });
const path = computed(() => calculatePath(props, labelPosition.value));


watch(labelPosition, () => {
  // This will trigger path recomputation whenever labelPosition changes
});

const calculatePath = (props, labelPos) => {
  const { sourceX, sourceY, targetX, targetY } = props;

  // 1. Calculate the midpoint of the edge
  const midX = (sourceX + targetX) / 2;
  const midY = (sourceY + targetY) / 2;

  // 2.  Adjust midpoint based on label position offset
  const adjustedMidX = midX + labelPos.x;
  const adjustedMidY = midY + labelPos.y;

  // 3. Construct the path string  (using cubic bezier for smoother curve)
  const path = `M ${sourceX} ${sourceY} C ${sourceX + (adjustedMidX - sourceX)/2} ${sourceY + (adjustedMidY - sourceY)/2}, ${targetX + (adjustedMidX - targetX)/2} ${targetY + (adjustedMidY - targetY)/2} , ${targetX} ${targetY}`;

  return [path, adjustedMidX, adjustedMidY];
};


const handleLabelDrag = (event) => {
  labelPosition.value =  {
    x: event.target.offsetLeft ,
    y: event.target.offsetTop
  };

};

const handleLabelDragEnd = (event) => {

}



</script>

<template>
  <BaseEdge :id="id" :style="style" :path="path[0]" :marker-end="markerEnd" />
  <EdgeLabelRenderer>
    <div
        :style="{
        pointerEvents: 'all',
        position: 'absolute',
        transform: `translate(-50%, -50%) translate(${path[1]}px,${path[2]}px)`
      }"

        @mousedown="handleLabelDrag"
        @mousemove.prevent="handleLabelDrag"
        @mouseup="handleLabelDragEnd"

        class="nodrag nopan"
    >
      <div :class="` border-primary-dark border p-1 bg-white`">
        <LabelIcon v-if="props.id !== 'connect'" :class="`size-4 cursor-move`"  />
      </div>
    </div>
  </EdgeLabelRenderer>
</template>