<script setup>
// import RespBase from './components/RespBase.vue'
import RespA from './components/RespA.vue'
import RespB from './components/RespB.vue'
</script>

<template>
  <h1>RespA</h1>
  <RespA
      id="edge-id"
      :sourceX="10"
      :sourceY="20"
      :targetX="30"
      :targetY="40"
      sourcePosition="top"
      targetPosition="bottom"
  />
  <h1>RespB</h1>
    <RespB
        id="edge-id"
        :sourceX="10"
        :sourceY="20"
        :targetX="30"
        :targetY="40"
        sourcePosition="top"
        targetPosition="bottom"
    />
</template>