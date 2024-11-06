import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import MyDialog from './MyDialog.vue'

describe('Dialog Open/Close Tests (Response 1)', () => {
  it('Test Case 1: dialog should open when q-btn is clicked', async () => {
    const wrapper = mount({
      template: `
        <div>
          <q-btn label="Open Dialog" @click="showDialog = true" />
          <MyDialog v-model="showDialog" />
        </div>
      `,
      components: { MyDialog },
      data() {
        return {
          showDialog: false
        }
      }
    })

    // Find and click the open button
    const openButton = wrapper.find('button')
    await openButton.trigger('click')

    // Check if dialog is shown
    expect(wrapper.vm.showDialog).toBe(true)
  })

  it('Test Case 2: dialog should close by itself when Apply is clicked', async () => {
    const wrapper = mount(MyDialog, {
      props: {
        modelValue: true  // Start with open dialog
      }
    })

    // Find and click Apply button
    const applyButton = wrapper.find('button[label="Apply"]')
    await applyButton.trigger('click')

    // Verify dialog emits close event
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')[0]).toEqual([false])
  })
})
