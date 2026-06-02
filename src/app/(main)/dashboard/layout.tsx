import { SidebarProvider } from '@/components/ui/sidebar';

import { ReactNode } from 'react';
import { AppSidebar } from './components/sidebar';
import { Navbar } from './components/navbar';
import GlobalModal from '@/components/modal-view/global-modal';

export default  function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <SidebarProvider>
            <div className="min-h-screen flex w-full">
                <AppSidebar />
                <div className="flex-1 flex flex-col min-w-0">
                    <Navbar />
                    <main className="flex-1 p-6 overflow-auto">
                        {children}
                    </main>
                </div>
            </div>
            <GlobalModal />
        </SidebarProvider>
    );
}
