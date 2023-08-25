export const modalComponent = () => ({
  showModal: false,

  close() {
    this.showModal = false
  },

  open() {
    this.showModal = true
  },
})
