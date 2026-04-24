import Sidebar from "@/app/components/SidebarAdmin";

export default function AdminLayout({ children }: any) {
    return (
        <div className="flex items-stretch">
            <Sidebar />
            <main className="flex-1 p-8">
                {children}
            </main>
        </div>
    );
}