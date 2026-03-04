import { db } from "@/server/db";
import { auth } from "@/server/auth";
import React from "react";
import { markNotificationAsRead } from "../actions";
import { revalidatePath } from "next/cache";

export async function NotificationsBox() {
    const session = await auth();
    if (!session?.user) return null;

    // Pobieramy 10 ostatnich powiadomień
    const allNotifications = await db.notification.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        take: 10,
    });

    // Grupowanie: Nieprzeczytane na górę, Przeczytane na dół
    // Wewnątrz grup nadal zachowują kolejność desc (od najnowszych) dzięki findMany
    const unread = allNotifications.filter(n => !n.read);
    const read = allNotifications.filter(n => n.read);

    return (
        <div className="border-2 border-[#30364F] bg-[#F0F0DB] rounded-none p-4 shadow-[4px_4px_0_#30364F] max-w-sm">
            <div className="flex justify-between items-center mb-4 border-b-2 border-[#30364F] pb-2">
                <span className="font-black tracking-tighter text-sm uppercase text-[#30364F]">
                    System_Logs
                </span>
                {unread.length > 0 && (
                    <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 font-bold animate-pulse">
                        {unread.length} NEW
                    </span>
                )}
            </div>

            <div className="space-y-4">
                {/* GRUPA: NOWE */}
                {unread.length > 0 && (
                    <ul className="space-y-2">
                        {unread.map((notif) => (
                            <li key={notif.id} className="group">
                                <form action={async () => {
                                    "use server";
                                    await markNotificationAsRead(notif.id);
                                }}>
                                    <button 
                                        type="submit"
                                        className="w-full text-left font-mono text-[11px] p-2 bg-[#E1D9BC] border-2 border-[#30364F] text-[#30364F] shadow-[2px_2px_0_#30364F] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />
                                        <div className="flex justify-between mb-1 opacity-70">
                                            <span>[!] UNREAD</span>
                                            <span>{notif.createdAt.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                        </div>
                                        <p className="font-bold leading-tight">{notif.message}</p>
                                    </button>
                                </form>
                            </li>
                        ))}
                    </ul>
                )}

                {/* ROZDZIELACZ */}
                {unread.length > 0 && read.length > 0 && (
                    <div className="border-t border-dashed border-[#30364F]/30 my-2" />
                )}

                {/* GRUPA: PRZECZYTANE */}
                {read.length > 0 && (
                    <ul className="space-y-2 opacity-60">
                        {read.map((notif) => (
                            <li 
                                key={notif.id} 
                                className="font-mono text-[10px] p-2 bg-transparent border border-[#30364F]/50 text-[#30364F] grayscale"
                            >
                                <div className="flex justify-between mb-1 text-[9px]">
                                    <span>[x] READ</span>
                                    <span>{notif.createdAt.toLocaleDateString()}</span>
                                </div>
                                <p>{notif.message}</p>
                            </li>
                        ))}
                    </ul>
                )}

                {allNotifications.length === 0 && (
                  <div className="font-mono text-[10px] text-center py-4 opacity-50 uppercase">
                    No logs available
                  </div>
                )}
            </div>
        </div>
    );
}