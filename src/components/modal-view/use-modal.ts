'use client';

import useModalStore from "./modal.service";


export function useModal() {

    const store = useModalStore()

    const openModal = ({
        view,
        title = "",
        description = "",
        className = ""
    }: {
        view: React.ReactNode;
        title?: string;
        description?: string;
        className?: string;
    }) => {
        store.actions.set({
            view: view,
            open: true,
            title,
            description,
            className,

        });
    };

    const closeModal = () => {
        store.actions.set({
            view: null,
            open: false,
            title: "",
            description: "",
            className: ""
        })
    };

    return {
        ...store,
        openModal,
        closeModal,
    };
}
