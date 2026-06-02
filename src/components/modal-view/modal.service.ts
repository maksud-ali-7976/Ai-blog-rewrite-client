import { create } from 'zustand'
import { combine } from 'zustand/middleware'





let timeOut: any

const useModalStore = create(
    combine(
        {
            open: false,
            view: null as React.ReactNode,
            title: "",
            description: "",
            className: "",
            showCloseButton: true,
        },
        (set, get) => ({
            actions: {

                set: (payload: Partial<ReturnType<typeof useModalStore.getInitialState>>) => {
                    set(prev => ({ ...prev, ...payload }))
                },
                setOpen: (value: boolean) => set({ open: value })

            }
        })
    )
)

export default useModalStore
