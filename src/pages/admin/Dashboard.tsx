import { useMemo } from "react";
import { 
    Users, 
    Calendar, 
    FileText, 
    DollarSign, 
    Vote, 
    Crown,
    TrendingUp,
    UserCheck,
    Clock,
    AlertCircle,
    BarChart3
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useNavigate } from "react-router-dom";
import { useAdminData } from "@/contexts/AdminDataContext";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Pie, PieChart, Cell, Legend } from "recharts";

const MEMBER_CHART_CONFIG: ChartConfig = {
    approved: { label: "Approved", color: "hsl(var(--brand-primary-600))" },
    pending: { label: "Pending", color: "hsl(var(--brand-secondary-600))" },
    rejected: { label: "Rejected", color: "hsl(var(--brand-feminine-600))" },
};

const PAYMENT_CHART_CONFIG: ChartConfig = {
    paid: { label: "Paid", color: "hsl(var(--brand-primary-600))" },
    pending: { label: "Pending", color: "hsl(var(--brand-secondary-600))" },
    failed: { label: "Failed", color: "hsl(var(--brand-feminine-600))" },
};

const REVENUE_CHART_CONFIG: ChartConfig = {
    amount: { label: "Revenue (SSP)", color: "hsl(var(--brand-primary-500))" },
};

const EVENTS_CHART_CONFIG: ChartConfig = {
    upcoming: { label: "Upcoming", color: "hsl(var(--brand-primary-500))" },
    past: { label: "Past", color: "hsl(var(--brand-secondary-600))" },
};

const Dashboard = () => {
    const navigate = useNavigate();
    const { members, payments, notifications, events, contactMessages } = useAdminData();

    const totalMembers = members.length;
    const pendingMembers = members.filter(m => m.status === "pending").length;
    const approvedMembers = members.filter(m => m.status === "approved").length;
    const totalRevenue = payments
        .filter(p => p.status === "paid")
        .reduce((sum, p) => {
            const numeric = parseFloat(p.amount.replace(/[^\d.]/g, ""));
            return sum + (isNaN(numeric) ? 0 : numeric);
        }, 0);

    const today = useMemo(() => {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        return d;
    }, []);
    const upcomingEventsCount = useMemo(() => 
        events.filter(e => e.published !== false && new Date(e.date) >= today).length,
        [events, today]
    );
    const unreadMessages = contactMessages.filter(m => !m.read).length;

    const stats = [
        {
            title: "Total Members",
            value: totalMembers.toString(),
            change: "",
            trend: "neutral",
            icon: Users,
            color: "text-[hsl(var(--brand-primary-600))]"
        },
        {
            title: "Pending Applications",
            value: pendingMembers.toString(),
            change: "",
            trend: "neutral",
            icon: UserCheck,
            color: "text-[hsl(var(--brand-secondary-600))]"
        },
        {
            title: "Upcoming Events",
            value: upcomingEventsCount.toString(),
            change: upcomingEventsCount ? "Published on site" : "No upcoming",
            trend: "neutral",
            icon: Calendar,
            color: "text-[hsl(var(--brand-primary-500))]"
        },
        {
            title: "Total Revenue",
            value: `${totalRevenue.toLocaleString()} SSP`,
            change: "",
            trend: "neutral",
            icon: DollarSign,
            color: "text-[hsl(var(--brand-secondary-700))]"
        },
        {
            title: "Unread Messages",
            value: unreadMessages.toString(),
            change: unreadMessages ? "Requires attention" : "All read",
            trend: "neutral",
            icon: AlertCircle,
            color: "text-[hsl(var(--brand-feminine-600))]"
        }
    ];

    const memberStatusData = useMemo(() => [
        { name: "Approved", value: approvedMembers, fill: "var(--color-approved)" },
        { name: "Pending", value: pendingMembers, fill: "var(--color-pending)" },
        { name: "Rejected", value: members.filter(m => m.status === "rejected").length, fill: "var(--color-rejected)" },
    ].filter(d => d.value > 0), [approvedMembers, pendingMembers, members]);

    const paymentStatusData = useMemo(() => [
        { name: "Paid", value: payments.filter(p => p.status === "paid").length, fill: "var(--color-paid)" },
        { name: "Pending", value: payments.filter(p => p.status === "pending").length, fill: "var(--color-pending)" },
        { name: "Failed", value: payments.filter(p => p.status === "failed").length, fill: "var(--color-failed)" },
    ].filter(d => d.value > 0), [payments]);

    const revenueByTypeData = useMemo(() => {
        const byType: Record<string, number> = {};
        payments.filter(p => p.status === "paid").forEach(p => {
            const type = p.type || "Other";
            byType[type] = (byType[type] || 0) + parseFloat(p.amount.replace(/[^\d.]/g, "")) || 0;
        });
        return Object.entries(byType).map(([type, amount]) => ({ type, amount: Math.round(amount) }));
    }, [payments]);

    const eventsOverviewData = useMemo(() => {
        const upcoming = events.filter(e => e.published !== false && new Date(e.date) >= today).length;
        const past = events.filter(e => new Date(e.date) < today).length;
        return [
            { name: "Upcoming", count: upcoming, fill: "var(--color-upcoming)" },
            { name: "Past", count: past, fill: "var(--color-past)" },
        ];
    }, [events, today]);

    const recentActivities = notifications.slice(0, 4).map((n, index) => ({
        id: n.id,
        type: n.type === "approval" ? "member" : "message",
        action: n.title,
        name: n.description,
        time: new Date(n.time).toLocaleString(),
        status: n.unread ? "pending" : "completed",
    }));

    const quickActions = [
        { title: "Manage Members", icon: Users, path: "/admin/members", color: "bg-[hsl(var(--brand-primary-500))]" },
        { title: "Create Event", icon: Calendar, path: "/admin/events", color: "bg-[hsl(var(--brand-secondary-500))]" },
        { title: "View Payments", icon: DollarSign, path: "/admin/payments", color: "bg-[hsl(var(--brand-primary-600))]" },
        { title: "Manage Elections", icon: Vote, path: "/admin/elections", color: "bg-[hsl(var(--brand-secondary-600))]" },
        { title: "Upload Document", icon: FileText, path: "/admin/documents", color: "bg-[hsl(var(--brand-primary-700))]" },
        { title: "Update Leadership", icon: Crown, path: "/admin/leadership", color: "bg-[hsl(var(--brand-feminine-500))]" },
    ];

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <p className="text-muted-foreground">Welcome back! Here's what's happening with NCAA today.</p>
                </div>

                {/* Statistics Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <Card key={index}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                                    <Icon className={`h-4 w-4 ${stat.color}`} />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stat.value}</div>
                                    {stat.change && (
                                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                            {stat.trend === "up" && <TrendingUp className="h-3 w-3 text-[hsl(var(--brand-primary-600))]" />}
                                            <span className={stat.trend === "up" ? "text-[hsl(var(--brand-primary-600))]" : ""}>
                                                {stat.change}
                                            </span>
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Website analytics */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5" />
                            Website analytics
                        </CardTitle>
                        <CardDescription>Performance and activity at a glance</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                            {/* Member status breakdown */}
                            <div className="space-y-2">
                                <h4 className="text-sm font-medium text-muted-foreground">Members by status</h4>
                                {memberStatusData.length > 0 ? (
                                    <ChartContainer config={MEMBER_CHART_CONFIG} className="h-[200px] w-full">
                                        <PieChart>
                                            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                                            <Pie
                                                data={memberStatusData}
                                                dataKey="value"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={50}
                                                outerRadius={80}
                                                paddingAngle={2}
                                                label={({ name, value }) => `${name}: ${value}`}
                                            >
                                                {memberStatusData.map((entry, i) => (
                                                    <Cell key={entry.name} fill={entry.fill} />
                                                ))}
                                            </Pie>
                                            <Legend />
                                        </PieChart>
                                    </ChartContainer>
                                ) : (
                                    <div className="flex h-[200px] items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
                                        No member data yet
                                    </div>
                                )}
                            </div>

                            {/* Payment status breakdown */}
                            <div className="space-y-2">
                                <h4 className="text-sm font-medium text-muted-foreground">Payments by status</h4>
                                {paymentStatusData.length > 0 ? (
                                    <ChartContainer config={PAYMENT_CHART_CONFIG} className="h-[200px] w-full">
                                        <PieChart>
                                            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                                            <Pie
                                                data={paymentStatusData}
                                                dataKey="value"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={50}
                                                outerRadius={80}
                                                paddingAngle={2}
                                                label={({ name, value }) => `${name}: ${value}`}
                                            >
                                                {paymentStatusData.map((entry, i) => (
                                                    <Cell key={entry.name} fill={entry.fill} />
                                                ))}
                                            </Pie>
                                            <Legend />
                                        </PieChart>
                                    </ChartContainer>
                                ) : (
                                    <div className="flex h-[200px] items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
                                        No payments yet
                                    </div>
                                )}
                            </div>

                            {/* Revenue by type */}
                            <div className="space-y-2 md:col-span-2">
                                <h4 className="text-sm font-medium text-muted-foreground">Revenue by type (SSP)</h4>
                                {revenueByTypeData.length > 0 ? (
                                    <ChartContainer config={REVENUE_CHART_CONFIG} className="h-[200px] w-full">
                                        <BarChart data={revenueByTypeData} margin={{ top: 8, right: 8, bottom: 24, left: 8 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                            <XAxis dataKey="type" tickLine={false} axisLine={false} />
                                            <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                                            <ChartTooltip content={<ChartTooltipContent formatter={(v) => [`${Number(v).toLocaleString()} SSP`, "Revenue"]} />} />
                                            <Bar dataKey="amount" radius={[4, 4, 0, 0]} fill="var(--color-amount)" />
                                        </BarChart>
                                    </ChartContainer>
                                ) : (
                                    <div className="flex h-[200px] items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
                                        No revenue data yet
                                    </div>
                                )}
                            </div>

                            {/* Events overview */}
                            <div className="space-y-2 md:col-span-2 lg:col-span-4">
                                <h4 className="text-sm font-medium text-muted-foreground">Events overview</h4>
                                {(eventsOverviewData[0].count > 0 || eventsOverviewData[1].count > 0) ? (
                                    <ChartContainer config={EVENTS_CHART_CONFIG} className="h-[200px] w-full">
                                        <BarChart data={eventsOverviewData} layout="vertical" margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
                                            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                            <XAxis type="number" tickLine={false} axisLine={false} />
                                            <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} width={80} />
                                            <ChartTooltip content={<ChartTooltipContent formatter={(v) => [v, "Events"]} />} />
                                            <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                                                {eventsOverviewData.map((entry, i) => (
                                                    <Cell key={entry.name} fill={entry.fill} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ChartContainer>
                                ) : (
                                    <div className="flex h-[200px] items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
                                        No events yet
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>Common administrative tasks</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {quickActions.map((action, index) => {
                                const Icon = action.icon;
                                return (
                                    <Button
                                        key={index}
                                        variant="outline"
                                        className="h-auto flex-col items-start justify-start p-4 hover:bg-muted"
                                        onClick={() => navigate(action.path)}
                                    >
                                        <div className={`${action.color} mb-3 rounded-lg p-2`}>
                                            <Icon className="h-5 w-5 text-white" />
                                        </div>
                                        <span className="font-semibold">{action.title}</span>
                                    </Button>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                            <CardDescription>Latest actions and updates</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentActivities.map((activity) => (
                                    <div key={activity.id} className="flex items-start gap-4 border-b pb-4 last:border-0 last:pb-0">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                                            {activity.type === "member" && <Users className="h-5 w-5" />}
                                            {activity.type === "payment" && <DollarSign className="h-5 w-5" />}
                                            {activity.type === "event" && <Calendar className="h-5 w-5" />}
                                            {activity.type === "election" && <Vote className="h-5 w-5" />}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">{activity.action}</p>
                                            <p className="text-sm text-muted-foreground">{activity.name}</p>
                                            {activity.amount && (
                                                <p className="text-xs text-muted-foreground">Amount: {activity.amount}</p>
                                            )}
                                            <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {activity.status === "pending" && (
                                                <span className="rounded-full bg-[hsl(var(--brand-secondary-100))] px-2 py-1 text-xs font-medium text-[hsl(var(--brand-secondary-800))]">
                                                    Pending
                                                </span>
                                            )}
                                            {activity.status === "completed" && (
                                                <span className="rounded-full bg-[hsl(var(--brand-primary-100))] px-2 py-1 text-xs font-medium text-[hsl(var(--brand-primary-800))]">
                                                    Completed
                                                </span>
                                            )}
                                            {activity.status === "active" && (
                                                <span className="rounded-full bg-[hsl(var(--brand-feminine-100))] px-2 py-1 text-xs font-medium text-[hsl(var(--brand-feminine-700))]">
                                                    Active
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pending Tasks */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Pending Tasks</CardTitle>
                            <CardDescription>Items requiring your attention</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3 rounded-lg border border-[hsl(var(--brand-secondary-200))] bg-[hsl(var(--brand-secondary-50))] p-4">
                                    <AlertCircle className="h-5 w-5 text-[hsl(var(--brand-secondary-600))] mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">Membership Applications</p>
                                        <p className="text-xs text-muted-foreground">Review and approve membership applications</p>
                                        <Button size="sm" variant="outline" className="mt-2" onClick={() => navigate("/admin/members")}>
                                            Review Now
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 rounded-lg border border-[hsl(var(--brand-primary-200))] bg-[hsl(var(--brand-primary-50))] p-4">
                                    <Clock className="h-5 w-5 text-[hsl(var(--brand-primary-600))] mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">Election Nominations</p>
                                        <p className="text-xs text-muted-foreground">Verify election nominations</p>
                                        <Button size="sm" variant="outline" className="mt-2" onClick={() => navigate("/admin/elections")}>
                                            Verify Now
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 rounded-lg border border-[hsl(var(--brand-feminine-200))] bg-[hsl(var(--brand-feminine-100))] p-4">
                                    <DollarSign className="h-5 w-5 text-[hsl(var(--brand-feminine-600))] mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">Pending Payments</p>
                                        <p className="text-xs text-muted-foreground">Confirm and manage payments</p>
                                        <Button size="sm" variant="outline" className="mt-2" onClick={() => navigate("/admin/payments")}>
                                            View Payments
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Dashboard;

