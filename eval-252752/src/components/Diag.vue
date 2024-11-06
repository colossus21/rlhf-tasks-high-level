<template>
  <q-dialog v-model="showDialog">
    <q-card style="min-width: 300px">
      <q-card-section>
        <div class="text-h6">Filter Options</div>

        <!-- Example filter controls -->
        <q-input v-model="filterText" label="Filter text" class="q-mt-md" />
        <q-select
          v-model="category"
          :options="['Option 1', 'Option 2', 'Option 3']"
          label="Category"
          class="q-mt-sm"
        />
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-btn
          dense
          borderless
          no-caps
          class="q-mt-lg full-width"
          color="primary"
          label="Apply"
          @click="applyAndClose"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, ref, watch } from 'vue'

export default defineComponent({
  name: 'MyDialog',

  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },

  emits: ['update:modelValue', 'applied'],

  setup(props, { emit }) {
    const showDialog = ref(props.modelValue)
    const filterText = ref('')
    const category = ref(null)

    // Sync with parent's v-model
    watch(() => props.modelValue, (newVal) => {
      showDialog.value = newVal
    })

    watch(showDialog, (newVal) => {
      emit('update:modelValue', newVal)
    })

    const applyAndClose = () => {
      // Example filter data
      const filterData = {
        text: filterText.value,
        category: category.value
      }

      emit('applied', filterData)
      emit('update:modelValue', false)
    }

    return {
      showDialog,
      filterText,
      category,
      applyAndClose
    }
  }
})
</script>
