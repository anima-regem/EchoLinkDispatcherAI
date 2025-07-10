import { ChangeEvent, useEffect, useState } from "react";
import { Call } from "@/app/live/page";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { AlertCircle, AlertTriangle, Search, ShieldCheck } from "lucide-react";

interface EventPanelProps {
    data: Record<string, Call> | undefined;
    selectedId: string | undefined;
    handleSelect: (id: string) => void;
}

const EventPanel = ({ data, selectedId, handleSelect }: EventPanelProps) => {
    const [search, setSearch] = useState("");

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearch(e.currentTarget.value);
    };

    return (
        <div className="absolute left-0 z-50 h-full w-[380px] max-w-md rounded-none bg-gradient-to-b from-slate-50 to-white shadow-2xl border-r border-slate-200">
            <div className="mb-4 flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white/80 backdrop-blur-sm">
                <h2 className="text-2xl font-bold text-slate-900 flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <span>Live Emergencies</span>
                </h2>
            </div>

            <div className="mb-6 px-4">
                <Input
                    className="w-full h-10 border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-lg shadow-sm"
                    placeholder="Search emergencies..."
                    startIcon={Search}
                    onChange={handleChange}
                />
            </div>

            <div className="mb-6 grid grid-cols-3 gap-3 px-4">
                <div className="bg-white rounded-lg p-3 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-2xl font-bold text-slate-900">
                        {data ? Object.keys(data).length : "0"}
                    </div>
                    <div className="text-xs text-slate-500 font-medium">Total Active</div>
                </div>
                <div className="bg-red-50 rounded-lg p-3 border border-red-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-2xl font-bold text-red-700">
                        {data
                            ? Object.entries(data).filter(
                                  ([_, value]) => value.severity === "CRITICAL",
                              ).length
                            : "0"}
                    </div>
                    <div className="text-xs text-red-600 font-medium">Critical</div>
                </div>
                <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-2xl font-bold text-emerald-700">
                        {data
                            ? Object.entries(data).filter(
                                  ([_, value]) => value.severity === "RESOLVED",
                              ).length
                            : "0"}
                    </div>
                    <div className="text-xs text-emerald-600 font-medium">Resolved</div>
                </div>
            </div>

            <div className="h-[calc(100dvh-250px)] space-y-2 overflow-y-scroll pb-3">
                {data &&
                    Object.entries(data)
                        .filter(([_, emergency]) =>
                            emergency.title?.includes(search),
                        )
                        .sort(([_, a], [__, b]) =>
                            new Date(a.time) < new Date(b.time) ? 1 : -1,
                        )
                        .map(([_, emergency]) => (
                            <Card
                                key={emergency.id}
                                className={cn(
                                    "mx-2 mb-3 flex cursor-pointer items-center p-4 transition-all duration-200 hover:shadow-lg hover:scale-[1.02] border border-slate-200 bg-white rounded-lg",
                                    selectedId === emergency.id &&
                                        "ring-2 ring-blue-500 ring-offset-2 shadow-lg scale-[1.02] bg-blue-50 border-blue-200",
                                    emergency.severity === "CRITICAL" && "hover:border-red-300",
                                    emergency.severity === "MODERATE" && "hover:border-yellow-300",
                                    emergency.severity === "RESOLVED" && "hover:border-emerald-300",
                                )}
                                onClick={() => handleSelect(emergency.id)}
                            >
                                {emergency.severity === "CRITICAL" && (
                                    <AlertCircle
                                        className="mr-3 min-w-6 text-red-500"
                                        size={24}
                                    />
                                )}
                                {emergency.severity === "MODERATE" && (
                                    <AlertTriangle
                                        className="mr-3 min-w-6 text-orange-500"
                                        size={24}
                                    />
                                )}
                                {emergency.severity === "RESOLVED" && (
                                    <ShieldCheck
                                        className="mr-3 min-w-6 text-green-500"
                                        size={24}
                                    />
                                )}
                                <CardContent className="flex-grow p-0">
                                    <div className="font-semibold">
                                        {emergency.title}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {new Date(
                                            emergency.time,
                                        ).toLocaleTimeString()}
                                    </div>
                                </CardContent>
                                {emergency.severity ? (
                                    <Badge
                                        className={cn(
                                            "min-w-fit uppercase",
                                            emergency.severity === "CRITICAL"
                                                ? "bg-red-500 hover:bg-red-500/80"
                                                : emergency.severity ===
                                                    "MODERATE"
                                                  ? "bg-yellow-500 hover:bg-yellow-500/80"
                                                  : "bg-green-500 hover:bg-green-500/80",
                                        )}
                                    >
                                        {emergency.severity}
                                    </Badge>
                                ) : null}
                            </Card>
                        ))}
            </div>
        </div>
    );
};

export default EventPanel;
