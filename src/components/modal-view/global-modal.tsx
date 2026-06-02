'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { CommandDialog } from '../ui/command';
import { useModal } from './use-modal';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { cn } from '@/lib/utils';
import { Command } from 'lucide-react';

export default function GlobalModal() {
    const { open, view, closeModal, ...rest } = useModal();
    const pathname = usePathname();
    useEffect(() => {
        closeModal();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    return (
        <Dialog open={open} onOpenChange={rest.actions.setOpen} modal={true}  >

            <DialogContent
                className={cn("overflow-hidden p-5", rest.className)}
                showCloseButton={rest.showCloseButton}
            >
                {
                    // rest.title ?

                    <DialogHeader >
                        <DialogTitle  >{rest.title}</DialogTitle>
                        <DialogDescription>{rest.description}</DialogDescription>
                    </DialogHeader>
                    // : <></>
                }
                {/* <Command className="[&_[cmdk-group-heading]]:text-muted-foreground **:data-[slot=command-input-wrapper]:h-12 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group]]:px-2 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
        </Command> */}
                {view}
            </DialogContent>
        </Dialog>
    );
}
