import { create } from 'zustand'

const useChatUiStore = create((set) => ({
  activeChannelId: null,
  modal: null,
  setActiveChannelId: (activeChannelId) => set({ activeChannelId }),
  openModal: (modal) => set({ modal }),
  closeModal: () => set({ modal: null }),
}))

export default useChatUiStore
