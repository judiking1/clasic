"use client";

import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/layout/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="ml-64 min-h-screen p-8">{children}</main>
    </div>
  );
}
