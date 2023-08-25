import Alpine from 'alpinejs'
import { fileInputComponent } from './file_input'
import { modalComponent } from './modal'
import { postFilesModalComponent } from './post_files_modal'

window.Alpine = Alpine

Alpine.data('file_input', fileInputComponent)
Alpine.data('modal', modalComponent)
Alpine.data('post_files_modal', postFilesModalComponent)

Alpine.start()
