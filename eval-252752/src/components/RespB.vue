<template>
  <div>
    <!-- Button to open dialog -->
    <q-btn label="Open Dialog" @click="dialogVisible = true" />

    <q-dialog v-model="dialogVisible">
      <q-card>
        <q-card-section>
          <!-- Your dialog content here -->
          <div>Dialog Content</div>
        </q-card-section>

        <q-card-actions>
          <q-btn
            dense
            borderless
            no-caps
            class="q-mt-lg full-width"
            color="primary"
            label="Apply"
            @click="applyFiltersAndClose"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  name: 'DialogComponent',
  data() {
    return {
      dialogVisible: false,
    };
  },
  methods: {
    applyFilters() {
      console.log('Filters applied');
    },
    applyFiltersAndClose() {
      this.applyFilters();
      this.dialogVisible = false;
    },
  },
};
</script>
