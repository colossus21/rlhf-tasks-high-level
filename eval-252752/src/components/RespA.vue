<template>
  <q-page padding>
    <!-- Button to open dialog -->
    <q-btn
      label="Open Dialog"
      color="primary"
      @click="showDialog = true"
    />

    <!-- Dialog component -->
    <MyDialog
      v-model="showDialog"
      @applied="handleApply"
    />

    <!-- Optional: Display applied filters -->
    <div v-if="appliedFilters" class="q-mt-md">
      <div class="text-h6">Applied Filters:</div>
      <pre>{{ JSON.stringify(appliedFilters, null, 2) }}</pre>
    </div>
  </q-page>
</template>

<script>
import {defineComponent, ref} from 'vue'
import MyDialog from 'components/Diag.vue'

export default defineComponent({
  name: 'IndexPage',

  components: {
    MyDialog
  },

  setup() {
    const showDialog = ref(false)
    const appliedFilters = ref(null)

    const handleApply = (filterData) => {
      appliedFilters.value = filterData
      console.log('Filters applied:', filterData)
    }

    return {
      showDialog,
      appliedFilters,
      handleApply
    }
  }
})
</script>
