"use client";

import { useEffect, useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const Header = ({ connected }: { connected: boolean }) => {
    const [time, setTime] = useState("");

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setTime(now.toLocaleTimeString());
        };
        updateTime();
        const intervalId = setInterval(updateTime, 1000);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="flex h-[60px] w-full items-center border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white px-8 shadow-sm">
            <div className="flex-between w-full text-sm font-semibold text-slate-800">
                <div className="flex items-center space-x-4">
                    <h1 className="text-lg font-bold text-slate-900">Emergency Center</h1>
                    <div className="flex items-center space-x-2">
                        <div
                            className={cn(
                                "h-3 w-3 rounded-full transition-all duration-300",
                                connected
                                    ? "bg-emerald-500 shadow-lg shadow-emerald-500/50 animate-pulse"
                                    : "bg-red-500 shadow-lg shadow-red-500/50 animate-pulse",
                            )}
                        />
                        <span className={cn(
                            "text-xs font-medium",
                            connected ? "text-emerald-600" : "text-red-600"
                        )}>
                            {connected ? "Connected" : "Offline"}
                        </span>
                    </div>
                </div>

                <div className="flex items-center space-x-6 font-medium">
                    <div className="flex items-center space-x-2 text-slate-600">
                        <div className="h-2 w-2 rounded-full bg-blue-400"></div>
                        <span>{time} PDT</span>
                    </div>
                    <div>
                        <Select defaultValue="SF">
                            <SelectTrigger className="h-[36px] w-[220px] rounded-lg border border-slate-300 bg-white px-3 text-slate-700 shadow-sm hover:border-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20">
                                <SelectValue placeholder="Select Location" />
                            </SelectTrigger>
                            <SelectContent className="rounded-lg border border-slate-200 bg-white shadow-xl">
                                <SelectItem value="SF" className="text-slate-700 hover:bg-slate-50">
                                    San Francisco, CA
                                </SelectItem>
                                <SelectItem value="BER" disabled className="text-slate-400">
                                    Berkeley, CA (Coming Soon)
                                </SelectItem>
                                <SelectItem value="OAK" disabled className="text-slate-400">
                                    Oakland, CA (Coming Soon)
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
