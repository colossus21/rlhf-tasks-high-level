import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import DialogComponent from './DialogComponent.vue'

describe('Dialog Open/Close Tests (Response 2)', () => {
  it('Test Case 1: dialog should open when q-btn is clicked', async () => {
    const wrapper = mount(DialogComponent)

    // Find and click the open button
    const openButton = wrapper.find('button')
    await openButton.trigger('click')

    // Check if dialog is visible
    expect(wrapper.vm.dialogVisible).toBe(true)
  })

  it('Test Case 2: dialog should close by itself when Apply is clicked', async () => {
    const wrapper = mount(DialogComponent)

    // Set dialog to visible initially
    await wrapper.setData({ dialogVisible: true })

    // Find and click Apply button
    const applyButton = wrapper.find('button[label="Apply"]')
    await applyButton.trigger('click')

    // Verify dialog is closed
    expect(wrapper.vm.dialogVisible).toBe(false)
  })
})
