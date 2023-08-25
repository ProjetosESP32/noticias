export const postFilesModalComponent = () => ({
  isLoading: false,
  inputs: [],
  lastId: 0,

  init() {
    this.addInput()
  },

  inputName(idx) {
    return `files[${idx}]`
  },

  inputId(id) {
    return `file-input-${id}`
  },

  addInput() {
    this.inputs.push(this.lastId++)
  },

  removeInput(id) {
    this.inputs = this.inputs.filter(i => i !== id)
  },

  onSubmit() {
    this.isLoading = true
  },
})
