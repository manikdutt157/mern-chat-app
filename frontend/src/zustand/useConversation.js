import {create} from "zustand";

const useConversation = create((set, get) => ({
    selectedConversation: null,
    setSelectedConversation: (selectedConversation) => set({selectedConversation}),
    messages: [],
    setMessages: (messages) => set({messages}),
    selectedMessages: new Set(),
    setSelectedMessages: (messageId) => set((state) => {
        const newSelectedMessages = new Set(state.selectedMessages);
        if (newSelectedMessages.has(messageId)) {
            newSelectedMessages.delete(messageId);
        } else {
            newSelectedMessages.add(messageId);
        }
        return { selectedMessages: newSelectedMessages };
    }),
    clearSelectedMessages: () => set({ selectedMessages: new Set() }),
    deleteSelectedMessages: async () => {
        const state = get();
        const selectedMsgsArray = Array.from(state.selectedMessages);
        
        // Update the messages state to remove selected messages
        set((state) => ({
            messages: state.messages.filter(msg => !state.selectedMessages.has(msg._id))
        }));
        
        // Clear selection
        state.clearSelectedMessages();
        
        // Return the array of selected message IDs
        return selectedMsgsArray;
    }
}))

export default useConversation;