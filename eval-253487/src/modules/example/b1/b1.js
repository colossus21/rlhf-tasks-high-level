import { LightningElement, track } from 'lwc';

export default class RadioButtonHorizontal extends LightningElement {
    @track value = ''; // to hold the selected value
    options = [
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' },
        { label: 'Option 3', value: 'option3' }
    ];

    handleChange(event) {
        this.value = event.detail.value;
    }
}