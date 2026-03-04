import { useState } from "react";
import { Users, Search, Filter, CheckCircle, XCircle, Eye, Mail, Phone, Edit } from "lucide-react";
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

const PAYAM_OPTIONS = [
    { value: "ajuong", label: "Ajuong Payam" },
    { value: "kongor", label: "Kongor Payam" },
    { value: "lith", label: "Lith Payam" },
    { value: "nyuak", label: "Nyuak Payam" },
    { value: "pakeer", label: "Pakeer Payam" },
    { value: "pawuoi", label: "Pawuoi Payam" },
];

const Members = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<"all" | "approved" | "pending" | "rejected">("all");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [addForm, setAddForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        payam: "",
        currentLocation: "",
        membershipType: "",
    });
    const [addFormErrors, setAddFormErrors] = useState<Record<string, string>>({});
    const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        payam: "",
        currentLocation: "",
        membershipType: "",
    });
    const [editFormErrors, setEditFormErrors] = useState<Record<string, string>>({});
    const { toast } = useToast();
    const { members, addMember, updateMember, approveMember, rejectMember } = useAdminData();

    const filteredMembers = members.filter(member => {
        const fullName = `${member.firstName} ${member.lastName}`.toLowerCase();
        const matchesSearch = fullName.includes(searchQuery.toLowerCase()) ||
                            member.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all" || member.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleApprove = (id: string) => {
        approveMember(id);
        toast({
            title: "Member Approved",
            description: "The member application has been approved.",
        });
    };

    const handleReject = (id: string) => {
        rejectMember(id);
        toast({
            title: "Member Rejected",
            description: "The member application has been rejected.",
        });
    };

    const handleAddMember = (e: React.FormEvent) => {
        e.preventDefault();
        const err: Record<string, string> = {};
        if (!addForm.firstName.trim()) err.firstName = "First name is required.";
        if (!addForm.lastName.trim()) err.lastName = "Last name is required.";
        if (!addForm.email.trim()) err.email = "Email is required.";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addForm.email.trim())) err.email = "Enter a valid email address.";
        if (!addForm.phone.trim()) err.phone = "Phone number is required.";
        if (!addForm.payam) err.payam = "Payam is required.";
        setAddFormErrors(err);
        if (Object.keys(err).length > 0) {
            toast({
                title: "Validation Error",
                description: "Please fill in all required fields correctly.",
                variant: "destructive",
            });
            return;
        }
        addMember({
            firstName: addForm.firstName.trim(),
            lastName: addForm.lastName.trim(),
            email: addForm.email.trim(),
            phone: addForm.phone.trim(),
            payam: addForm.payam,
            currentLocation: addForm.currentLocation.trim() || undefined,
            membershipType: addForm.membershipType.trim() || undefined,
        });
        toast({
            title: "Member Added",
            description: `${addForm.firstName.trim()} ${addForm.lastName.trim()} has been added. You can approve them from the list.`,
        });
        setAddForm({
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            payam: "",
            currentLocation: "",
            membershipType: "",
        });
        setAddFormErrors({});
        setIsAddDialogOpen(false);
    };

    const handleEditClick = (member: (typeof members)[0]) => {
        setEditForm({
            firstName: member.firstName,
            lastName: member.lastName,
            email: member.email,
            phone: member.phone,
            payam: member.payam?.toLowerCase() ?? "",
            currentLocation: member.currentLocation ?? "",
            membershipType: member.membershipType ?? "",
        });
        setEditFormErrors({});
        setEditingMemberId(member.id);
    };

    const handleUpdateMember = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingMemberId) return;
        const err: Record<string, string> = {};
        if (!editForm.firstName.trim()) err.firstName = "First name is required.";
        if (!editForm.lastName.trim()) err.lastName = "Last name is required.";
        if (!editForm.email.trim()) err.email = "Email is required.";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.email.trim())) err.email = "Enter a valid email address.";
        if (!editForm.phone.trim()) err.phone = "Phone number is required.";
        if (!editForm.payam) err.payam = "Payam is required.";
        setEditFormErrors(err);
        if (Object.keys(err).length > 0) {
            toast({
                title: "Validation Error",
                description: "Please fill in all required fields correctly.",
                variant: "destructive",
            });
            return;
        }
        updateMember(editingMemberId, {
            firstName: editForm.firstName.trim(),
            lastName: editForm.lastName.trim(),
            email: editForm.email.trim(),
            phone: editForm.phone.trim(),
            payam: editForm.payam,
            currentLocation: editForm.currentLocation.trim() || undefined,
            membershipType: editForm.membershipType.trim() || undefined,
        });
        toast({
            title: "Member Updated",
            description: "Member details have been saved.",
        });
        setEditingMemberId(null);
    };

    const stats = {
        total: members.length,
        approved: members.filter(m => m.status === "approved").length,
        pending: members.filter(m => m.status === "pending").length,
        rejected: members.filter(m => m.status === "rejected").length,
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Member Management</h1>
                        <p className="text-muted-foreground">Manage member applications and memberships</p>
                    </div>
                    <Dialog open={isAddDialogOpen} onOpenChange={(open) => { setIsAddDialogOpen(open); if (!open) setAddFormErrors({}); }}>
                        <Button type="button" onClick={() => setIsAddDialogOpen(true)}>
                            <Users className="mr-2 h-4 w-4" />
                            Add Member
                        </Button>
                        <DialogContent className="max-w-md max-h-[90vh] flex flex-col overflow-hidden">
                            <DialogHeader>
                                <DialogTitle>Add Member</DialogTitle>
                                <DialogDescription>Add a new member manually. They will appear as pending until you approve them.</DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleAddMember} className="flex flex-col min-h-0 flex-1">
                                <div className="grid gap-4 py-4 overflow-y-auto min-h-0">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="add-firstName">First Name *</Label>
                                            <Input
                                                id="add-firstName"
                                                placeholder="First name"
                                                value={addForm.firstName}
                                                onChange={(e) => setAddForm({ ...addForm, firstName: e.target.value })}
                                                className={addFormErrors.firstName ? "border-destructive" : ""}
                                            />
                                            {addFormErrors.firstName && <p className="text-sm text-destructive">{addFormErrors.firstName}</p>}
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="add-lastName">Last Name *</Label>
                                            <Input
                                                id="add-lastName"
                                                placeholder="Last name"
                                                value={addForm.lastName}
                                                onChange={(e) => setAddForm({ ...addForm, lastName: e.target.value })}
                                                className={addFormErrors.lastName ? "border-destructive" : ""}
                                            />
                                            {addFormErrors.lastName && <p className="text-sm text-destructive">{addFormErrors.lastName}</p>}
                                        </div>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="add-email">Email *</Label>
                                        <Input
                                            id="add-email"
                                            type="email"
                                            placeholder="email@example.com"
                                            value={addForm.email}
                                            onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                                            className={addFormErrors.email ? "border-destructive" : ""}
                                        />
                                        {addFormErrors.email && <p className="text-sm text-destructive">{addFormErrors.email}</p>}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="add-phone">Phone *</Label>
                                        <Input
                                            id="add-phone"
                                            type="tel"
                                            placeholder="e.g. +211..."
                                            value={addForm.phone}
                                            onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })}
                                            className={addFormErrors.phone ? "border-destructive" : ""}
                                        />
                                        {addFormErrors.phone && <p className="text-sm text-destructive">{addFormErrors.phone}</p>}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="add-payam">Payam *</Label>
                                        <Select value={addForm.payam} onValueChange={(v) => setAddForm({ ...addForm, payam: v })}>
                                            <SelectTrigger id="add-payam" className={addFormErrors.payam ? "border-destructive" : ""}>
                                                <SelectValue placeholder="Select Payam" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {PAYAM_OPTIONS.map((p) => (
                                                    <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {addFormErrors.payam && <p className="text-sm text-destructive">{addFormErrors.payam}</p>}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="add-location">Current Location (optional)</Label>
                                        <Input
                                            id="add-location"
                                            placeholder="City or region"
                                            value={addForm.currentLocation}
                                            onChange={(e) => setAddForm({ ...addForm, currentLocation: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="add-membershipType">Membership Type (optional)</Label>
                                        <Input
                                            id="add-membershipType"
                                            placeholder="e.g. Full, Associate"
                                            value={addForm.membershipType}
                                            onChange={(e) => setAddForm({ ...addForm, membershipType: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <DialogFooter className="flex-shrink-0 border-t border-border pt-4 mt-2">
                                    <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                                    <Button type="submit">Add Member</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>

                    {/* Edit Member Dialog */}
                    <Dialog open={editingMemberId !== null} onOpenChange={(open) => { if (!open) setEditingMemberId(null); setEditFormErrors({}); }}>
                        <DialogContent className="max-w-md max-h-[90vh] flex flex-col overflow-hidden">
                            <DialogHeader>
                                <DialogTitle>Edit Member</DialogTitle>
                                <DialogDescription>Update member details. Status and payment status are unchanged.</DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleUpdateMember} className="flex flex-col min-h-0 flex-1">
                                <div className="grid gap-4 py-4 overflow-y-auto min-h-0">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="edit-firstName">First Name *</Label>
                                            <Input
                                                id="edit-firstName"
                                                placeholder="First name"
                                                value={editForm.firstName}
                                                onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                                                className={editFormErrors.firstName ? "border-destructive" : ""}
                                            />
                                            {editFormErrors.firstName && <p className="text-sm text-destructive">{editFormErrors.firstName}</p>}
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="edit-lastName">Last Name *</Label>
                                            <Input
                                                id="edit-lastName"
                                                placeholder="Last name"
                                                value={editForm.lastName}
                                                onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                                                className={editFormErrors.lastName ? "border-destructive" : ""}
                                            />
                                            {editFormErrors.lastName && <p className="text-sm text-destructive">{editFormErrors.lastName}</p>}
                                        </div>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="edit-email">Email *</Label>
                                        <Input
                                            id="edit-email"
                                            type="email"
                                            placeholder="email@example.com"
                                            value={editForm.email}
                                            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                            className={editFormErrors.email ? "border-destructive" : ""}
                                        />
                                        {editFormErrors.email && <p className="text-sm text-destructive">{editFormErrors.email}</p>}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="edit-phone">Phone *</Label>
                                        <Input
                                            id="edit-phone"
                                            type="tel"
                                            placeholder="e.g. +211..."
                                            value={editForm.phone}
                                            onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                            className={editFormErrors.phone ? "border-destructive" : ""}
                                        />
                                        {editFormErrors.phone && <p className="text-sm text-destructive">{editFormErrors.phone}</p>}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="edit-payam">Payam *</Label>
                                        <Select value={editForm.payam} onValueChange={(v) => setEditForm({ ...editForm, payam: v })}>
                                            <SelectTrigger id="edit-payam" className={editFormErrors.payam ? "border-destructive" : ""}>
                                                <SelectValue placeholder="Select Payam" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {PAYAM_OPTIONS.map((p) => (
                                                    <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {editFormErrors.payam && <p className="text-sm text-destructive">{editFormErrors.payam}</p>}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="edit-location">Current Location (optional)</Label>
                                        <Input
                                            id="edit-location"
                                            placeholder="City or region"
                                            value={editForm.currentLocation}
                                            onChange={(e) => setEditForm({ ...editForm, currentLocation: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="edit-membershipType">Membership Type (optional)</Label>
                                        <Input
                                            id="edit-membershipType"
                                            placeholder="e.g. Full, Associate"
                                            value={editForm.membershipType}
                                            onChange={(e) => setEditForm({ ...editForm, membershipType: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <DialogFooter className="flex-shrink-0 border-t border-border pt-4 mt-2">
                                    <Button type="button" variant="outline" onClick={() => setEditingMemberId(null)}>Cancel</Button>
                                    <Button type="submit">Save Changes</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Statistics */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Approved</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-[hsl(var(--brand-primary-600))]">{stats.approved}</div>
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
                            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-[hsl(var(--brand-feminine-600))]">{stats.rejected}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle>Search & Filter</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-4 md:flex-row">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        placeholder="Search by name or email..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-9"
                                    />
                                </div>
                            </div>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-full md:w-48">
                                    <Filter className="mr-2 h-4 w-4" />
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="approved">Approved</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Members Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Members</CardTitle>
                        <CardDescription>View and manage all member applications</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Contact</TableHead>
                                        <TableHead>Payam</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Payment</TableHead>
                                        <TableHead>Applied</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredMembers.map((member) => (
                                        <TableRow key={member.id}>
                                            <TableCell className="font-medium">
                                                {member.firstName} {member.lastName}
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1 text-sm">
                                                    <div className="flex items-center gap-1">
                                                        <Mail className="h-3 w-3" />
                                                        {member.email}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Phone className="h-3 w-3" />
                                                        {member.phone}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>{member.payam}</TableCell>
                                            <TableCell>{member.membershipType ?? "-"}</TableCell>
                                            <TableCell>
                                                {member.status === "approved" && (
                                                    <Badge className="bg-[hsl(var(--brand-primary-100))] text-[hsl(var(--brand-primary-800))]">Approved</Badge>
                                                )}
                                                {member.status === "pending" && (
                                                    <Badge className="bg-[hsl(var(--brand-secondary-100))] text-[hsl(var(--brand-secondary-800))]">Pending</Badge>
                                                )}
                                                {member.status === "rejected" && (
                                                    <Badge className="bg-[hsl(var(--brand-feminine-100))] text-[hsl(var(--brand-feminine-700))]">Rejected</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {member.paymentStatus === "paid" && (
                                                    <Badge variant="outline" className="border-[hsl(var(--brand-primary-500))] text-[hsl(var(--brand-primary-700))]">Paid</Badge>
                                                )}
                                                {member.paymentStatus === "pending" && (
                                                    <Badge variant="outline" className="border-[hsl(var(--brand-secondary-500))] text-[hsl(var(--brand-secondary-700))]">Pending</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">{member.appliedDate}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-8 w-8 p-0"
                                                        onClick={() => handleEditClick(member)}
                                                        aria-label={`Edit ${member.firstName} ${member.lastName}`}
                                                    >
                                                        <Edit className="h-4 w-4 text-[hsl(var(--brand-primary-600))]" />
                                                    </Button>
                                                    {member.status === "pending" && (
                                                        <>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="h-8 w-8 p-0"
                                                                onClick={() => handleApprove(member.id)}
                                                            >
                                                                <CheckCircle className="h-4 w-4 text-[hsl(var(--brand-primary-600))]" />
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="h-8 w-8 p-0"
                                                                onClick={() => handleReject(member.id)}
                                                            >
                                                                <XCircle className="h-4 w-4 text-[hsl(var(--brand-feminine-600))]" />
                                                            </Button>
                                                        </>
                                                    )}
                                                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0" aria-label="View">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </div>
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

export default Members;

