import { useState } from "react";
import { DollarSign, Search, Download, CheckCircle, XCircle, Filter, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useToast } from "@/hooks/use-toast";
import { useAdminData } from "@/contexts/AdminDataContext";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

const PAYMENT_TYPES = [
    { value: "Membership", label: "Membership" },
    { value: "Donation", label: "Donation" },
    { value: "Event", label: "Event" },
    { value: "Other", label: "Other" },
];

const PAYMENT_METHODS = [
    { value: "Cash", label: "Cash" },
    { value: "Mobile Money", label: "Mobile Money" },
    { value: "Bank Transfer", label: "Bank Transfer" },
    { value: "Other", label: "Other" },
];

const Payments = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<"all" | "paid" | "pending" | "failed">("all");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [addForm, setAddForm] = useState({
        memberName: "",
        memberEmail: "",
        amount: "",
        type: "Membership",
        method: "Cash",
    });
    const [addFormErrors, setAddFormErrors] = useState<Record<string, string>>({});
    const { toast } = useToast();
    const { payments, addPayment } = useAdminData();

    const filteredPayments = payments.filter(payment => {
        const matchesSearch = payment.memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            payment.memberEmail.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const totalRevenue = payments
        .filter(p => p.status === "paid")
        .reduce((sum, p) => {
            const numeric = parseFloat(p.amount.replace(/[^\d.]/g, ""));
            return sum + (isNaN(numeric) ? 0 : numeric);
        }, 0);

    const paidRevenue = payments
        .filter(p => p.status === "paid")
        .reduce((sum, p) => {
            const numeric = parseFloat(p.amount.replace(/[^\d.]/g, ""));
            return sum + (isNaN(numeric) ? 0 : numeric);
        }, 0);

    const pendingRevenue = payments
        .filter(p => p.status === "pending")
        .reduce((sum, p) => {
            const numeric = parseFloat(p.amount.replace(/[^\d.]/g, ""));
            return sum + (isNaN(numeric) ? 0 : numeric);
        }, 0);

    const failedRevenue = payments
        .filter(p => p.status === "failed")
        .reduce((sum, p) => {
            const numeric = parseFloat(p.amount.replace(/[^\d.]/g, ""));
            return sum + (isNaN(numeric) ? 0 : numeric);
        }, 0);

    const stats = {
        total: `${totalRevenue.toLocaleString()} SSP`,
        paid: `${paidRevenue.toLocaleString()} SSP`,
        pending: `${pendingRevenue.toLocaleString()} SSP`,
        failed: `${failedRevenue.toLocaleString()} SSP`,
    };

    const handleExport = () => {
        const csvContent = [
            ["Member Name", "Email", "Amount", "Type", "Method", "Date", "Status"],
            ...filteredPayments.map(p => [
                p.memberName,
                p.memberEmail,
                p.amount,
                p.type,
                p.method,
                new Date(p.date).toLocaleDateString(),
                p.status
            ])
        ].map(row => row.join(",")).join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `payments-export-${new Date().toISOString().split("T")[0]}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast({
            title: "Export Successful",
            description: "Payments data has been exported to CSV.",
        });
    };

    const handleApprove = (id: string) => {
        toast({
            title: "Payment Approved",
            description: "The payment has been confirmed.",
        });
    };

    const handleReject = (id: string) => {
        toast({
            title: "Payment Rejected",
            description: "The payment has been rejected.",
        });
    };

    const handleAddPayment = (e: React.FormEvent) => {
        e.preventDefault();
        const err: Record<string, string> = {};
        if (!addForm.memberName.trim()) err.memberName = "Member name is required.";
        if (!addForm.memberEmail.trim()) err.memberEmail = "Email is required.";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addForm.memberEmail.trim())) err.memberEmail = "Enter a valid email address.";
        if (!addForm.amount.trim()) err.amount = "Amount is required.";
        else if (!/^[\d.,]+$/.test(addForm.amount.replace(/\s/g, ""))) err.amount = "Enter a valid amount (numbers only).";
        setAddFormErrors(err);
        if (Object.keys(err).length > 0) {
            toast({
                title: "Validation Error",
                description: "Please fill in all required fields correctly.",
                variant: "destructive",
            });
            return;
        }
        const amountDisplay = addForm.amount.trim().includes("SSP") || /^\d+$/.test(addForm.amount.trim())
            ? addForm.amount.trim()
            : `${addForm.amount.trim()} SSP`;
        addPayment({
            memberName: addForm.memberName.trim(),
            memberEmail: addForm.memberEmail.trim(),
            amount: amountDisplay,
            type: addForm.type,
            method: addForm.method,
            status: "paid",
        });
        toast({
            title: "Payment Recorded",
            description: `Cash payment of ${amountDisplay} for ${addForm.memberName.trim()} has been added.`,
        });
        setAddForm({ memberName: "", memberEmail: "", amount: "", type: "Membership", method: "Cash" });
        setAddFormErrors({});
        setIsAddDialogOpen(false);
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Payment Management</h1>
                        <p className="text-muted-foreground">Track and manage membership payments</p>
                    </div>
                    <Dialog open={isAddDialogOpen} onOpenChange={(open) => { setIsAddDialogOpen(open); if (!open) setAddFormErrors({}); }}>
                        <Button type="button" onClick={() => setIsAddDialogOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Record cash payment
                        </Button>
                        <DialogContent className="max-w-md">
                            <DialogHeader>
                                <DialogTitle>Record payment</DialogTitle>
                                <DialogDescription>Add a payment received in cash (or another method). It will be recorded as paid.</DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleAddPayment}>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="add-memberName">Member name *</Label>
                                        <Input
                                            id="add-memberName"
                                            placeholder="Full name"
                                            value={addForm.memberName}
                                            onChange={(e) => setAddForm({ ...addForm, memberName: e.target.value })}
                                            className={addFormErrors.memberName ? "border-destructive" : ""}
                                        />
                                        {addFormErrors.memberName && <p className="text-sm text-destructive">{addFormErrors.memberName}</p>}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="add-memberEmail">Email *</Label>
                                        <Input
                                            id="add-memberEmail"
                                            type="email"
                                            placeholder="email@example.com"
                                            value={addForm.memberEmail}
                                            onChange={(e) => setAddForm({ ...addForm, memberEmail: e.target.value })}
                                            className={addFormErrors.memberEmail ? "border-destructive" : ""}
                                        />
                                        {addFormErrors.memberEmail && <p className="text-sm text-destructive">{addFormErrors.memberEmail}</p>}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="add-amount">Amount *</Label>
                                        <Input
                                            id="add-amount"
                                            placeholder="e.g. 5000 or 5000 SSP"
                                            value={addForm.amount}
                                            onChange={(e) => setAddForm({ ...addForm, amount: e.target.value })}
                                            className={addFormErrors.amount ? "border-destructive" : ""}
                                        />
                                        {addFormErrors.amount && <p className="text-sm text-destructive">{addFormErrors.amount}</p>}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="add-type">Type</Label>
                                        <Select value={addForm.type} onValueChange={(v) => setAddForm({ ...addForm, type: v })}>
                                            <SelectTrigger id="add-type">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {PAYMENT_TYPES.map((p) => (
                                                    <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="add-method">Method</Label>
                                        <Select value={addForm.method} onValueChange={(v) => setAddForm({ ...addForm, method: v })}>
                                            <SelectTrigger id="add-method">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {PAYMENT_METHODS.map((p) => (
                                                    <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <DialogFooter className="border-t border-border pt-4 mt-2">
                                    <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                                    <Button type="submit">Add payment</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Statistics */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Paid</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-[hsl(var(--brand-primary-600))]">{stats.paid}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Pending</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-[hsl(var(--brand-secondary-600))]">{stats.pending}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Failed</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-[hsl(var(--brand-feminine-600))]">{stats.failed}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle>Search & Filter</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-4 md:flex-row md:items-center">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        placeholder="Search by member name or email..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-9"
                                    />
                                </div>
                            </div>
                            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as typeof statusFilter)}>
                                <SelectTrigger className="w-full md:w-48">
                                    <Filter className="mr-2 h-4 w-4" />
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="paid">Paid</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="failed">Failed</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button variant="outline" onClick={handleExport}>
                                <Download className="mr-2 h-4 w-4" />
                                Export
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Payments Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Payments</CardTitle>
                        <CardDescription>All payment transactions</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Member</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Method</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredPayments.map((payment) => (
                                        <TableRow key={payment.id}>
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium">{payment.memberName}</div>
                                                    <div className="text-sm text-muted-foreground">{payment.memberEmail}</div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-semibold">{payment.amount}</TableCell>
                                            <TableCell>{payment.type}</TableCell>
                                            <TableCell>{payment.method}</TableCell>
                                            <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                                            <TableCell>
                                                {payment.status === "paid" && (
                                                    <Badge className="bg-[hsl(var(--brand-primary-100))] text-[hsl(var(--brand-primary-800))]">Paid</Badge>
                                                )}
                                                {payment.status === "pending" && (
                                                    <Badge className="bg-[hsl(var(--brand-secondary-100))] text-[hsl(var(--brand-secondary-800))]">Pending</Badge>
                                                )}
                                                {payment.status === "failed" && (
                                                    <Badge className="bg-[hsl(var(--brand-feminine-100))] text-[hsl(var(--brand-feminine-700))]">Failed</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {payment.status === "pending" && (
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="h-8 w-8 p-0"
                                                            onClick={() => handleApprove(payment.id)}
                                                        >
                                                            <CheckCircle className="h-4 w-4 text-[hsl(var(--brand-primary-600))]" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="h-8 w-8 p-0"
                                                            onClick={() => handleReject(payment.id)}
                                                        >
                                                            <XCircle className="h-4 w-4 text-[hsl(var(--brand-feminine-600))]" />
                                                        </Button>
                                                    </div>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
};

export default Payments;

