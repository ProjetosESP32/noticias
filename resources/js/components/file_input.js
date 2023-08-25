export const fileInputComponent = () => ({
  filename: null,

  get label() {
    return this.filename ? `Arquivo: ${this.filename}` : 'Selecione um arquivo'
  },

  onInput(e) {
    if (e.target.files) {
      this.filename = e.target.files[0].name
    }
  },
})
