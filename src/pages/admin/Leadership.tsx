import { useState, useMemo, type ElementType } from "react";
import { Crown, Plus, Edit, Trash2, MapPin, UserCircle, FileText, DollarSign, Users, Megaphone, Scale, GraduationCap, Heart, Trophy, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useToast } from "@/hooks/use-toast";
import { useAdminData } from "@/contexts/AdminDataContext";
import { executiveCommittee as staticExecutive, payamRepresentatives as staticPayam } from "@/data/leadership";
import type { ExecutiveCommitteeMember } from "@/data/leadership";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

/** Order from most superior (Chairlady) to least for admin display. */
const POSITION_ORDER = [
    "Chairlady",
    "Deputy Chairlady",
    "Secretary General",
    "Deputy Secretary General",
    "Finance Secretary",
    "Deputy Finance Secretary",
    "Information Secretary",
    "Deputy Information Secretary",
    "Secretary for Internal and External Affairs",
    "Secretary for Legal Affairs",
    "Secretary for Education",
    "Secretary for Health",
    "Secretary for Culture and Sports",
    "Advisor",
];

const iconMap: Record<string, ElementType> = {
    Crown,
    UserCircle,
    FileText,
    DollarSign,
    Users,
    Megaphone,
    Scale,
    GraduationCap,
    Heart,
    Trophy,
    Lightbulb,
};

const Leadership = () => {
    const { toast } = useToast();
    const {
        executiveCommittee,
        payamRepresentatives,
        addExecutiveMember,
        updateExecutiveMember,
        deleteExecutiveMember,
        addPayamRepresentative,
        updatePayamRepresentative,
        deletePayamRepresentative,
    } = useAdminData();

    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<{ id: string; type: "executive" | "payam" } | null>(null);
    const [addForm, setAddForm] = useState({
        name: "",
        position: "",
        description: "",
        type: "executive" as "executive" | "payam",
        payam: "",
        color: "from-[hsl(var(--brand-primary-500))] to-[hsl(var(--brand-secondary-500))]",
        icon: "UserCircle",
        image: "",
    });
    const [editForm, setEditForm] = useState({
        name: "",
        position: "",
        description: "",
        payam: "",
        color: "from-[hsl(var(--brand-primary-500))] to-[hsl(var(--brand-secondary-500))]",
        icon: "UserCircle",
        image: "",
    });

    const handleEdit = (id: string, type: "executive" | "payam") => {
        setEditingMember({ id, type });
        if (type === "executive") {
            const member = executiveCommittee.find(m => m.id === id);
            if (member) {
                setEditForm({
                    name: member.name,
                    position: member.position,
                    description: member.description,
                    payam: "",
                    color: member.color,
                    icon: member.icon ?? "UserCircle",
                    image: member.image ?? "",
                });
            }
        } else {
            const rep = payamRepresentatives.find(r => r.id === id);
            if (rep) {
                const staticRep = staticPayam.find((s) => s.payam === rep.payam);
                setEditForm({
                    name: rep.name || staticRep?.name || "",
                    position: rep.position ?? staticRep?.position ?? "",
                    description: "",
                    payam: rep.payam,
                    color: "",
                    icon: "UserCircle",
                    image: rep.image ?? staticRep?.image ?? "",
                });
            }
        }
        setIsEditDialogOpen(true);
    };

    const handleSaveEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingMember) return;

        if (editingMember.type === "executive") {
            if (!editForm.name || !editForm.position) {
                toast({
                    title: "Validation Error",
                    description: "Please fill in all required fields.",
                    variant: "destructive",
                });
                return;
            }
            try {
                await updateExecutiveMember(editingMember.id, {
                    name: editForm.name,
                    position: normalizePosition(editForm.position),
                    description: editForm.description,
                    color: editForm.color,
                    icon: editForm.icon,
                    image: editForm.image.trim() || undefined,
                });
                toast({
                    title: "Member Updated",
                    description: "Executive committee member has been updated.",
                });
            } catch (error) {
                toast({
                    title: "Update failed",
                    description: error instanceof Error ? error.message : "Failed to update member.",
                    variant: "destructive",
                });
                return;
            }
        } else {
            if (!editForm.name || !editForm.payam) {
                toast({
                    title: "Validation Error",
                    description: "Please fill in all required fields.",
                    variant: "destructive",
                });
                return;
            }
            try {
                await updatePayamRepresentative(editingMember.id, {
                    name: editForm.name,
                    payam: editForm.payam,
                    position: editForm.position.trim() || undefined,
                    image: editForm.image.trim() || undefined,
                });
                toast({
                    title: "Representative Updated",
                    description: "Payam representative has been updated.",
                });
            } catch (error) {
                toast({
                    title: "Update failed",
                    description: error instanceof Error ? error.message : "Failed to update representative.",
                    variant: "destructive",
                });
                return;
            }
        }
        setIsEditDialogOpen(false);
        setEditingMember(null);
    };

    const handleDelete = async (id: string, type: "executive" | "payam", name: string) => {
        if (confirm(`Are you sure you want to remove ${name}?`)) {
            try {
                if (type === "executive") {
                    await deleteExecutiveMember(id);
                } else {
                    await deletePayamRepresentative(id);
                }
                toast({
                    title: "Leadership Member Removed",
                    description: `${name} has been removed from ${type === "executive" ? "executive committee" : "payam representatives"}.`,
                });
            } catch (error) {
                toast({
                    title: "Delete failed",
                    description: error instanceof Error ? error.message : "Failed to delete leadership member.",
                    variant: "destructive",
                });
            }
        }
    };

    // Normalize position: Chairperson → Chairlady, Deputy Chairperson → Deputy Chairlady (display and save)
    const normalizePosition = (position: string) => {
        const p = position.trim();
        if (p === "Chairperson") return "Chairlady";
        if (p === "Deputy Chairperson" || p.toLowerCase() === "deputy chairperson") return "Deputy Chairlady";
        return p;
    };
    const displayPosition = (position: string) => normalizePosition(position);

    // Sort executive committee: Chairlady first, then by POSITION_ORDER
    const sortedExecutiveCommittee = useMemo(() => {
        return [...executiveCommittee].sort((a, b) => {
            const posA = displayPosition(a.position);
            const posB = displayPosition(b.position);
            const i = POSITION_ORDER.indexOf(posA);
            const j = POSITION_ORDER.indexOf(posB);
            const rankA = i === -1 ? POSITION_ORDER.length : i;
            const rankB = j === -1 ? POSITION_ORDER.length : j;
            return rankA - rankB;
        });
    }, [executiveCommittee]);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (addForm.type === "executive") {
            if (!addForm.name || !addForm.position) {
                toast({
                    title: "Validation Error",
                    description: "Please fill in all required fields.",
                    variant: "destructive",
                });
                return;
            }
            try {
                await addExecutiveMember({
                    name: addForm.name,
                    position: normalizePosition(addForm.position),
                    description: addForm.description,
                    color: addForm.color,
                    icon: addForm.icon,
                    image: addForm.image.trim() || undefined,
                });
                toast({
                    title: "Member Added",
                    description: `${addForm.name} has been added to executive committee.`,
                });
            } catch (error) {
                toast({
                    title: "Add failed",
                    description: error instanceof Error ? error.message : "Failed to add member.",
                    variant: "destructive",
                });
                return;
            }
        } else {
            if (!addForm.name || !addForm.payam) {
                toast({
                    title: "Validation Error",
                    description: "Please fill in all required fields.",
                    variant: "destructive",
                });
                return;
            }

            try {
                await addPayamRepresentative({
                    name: addForm.name,
                    payam: addForm.payam,
                    ...(addForm.position?.trim() && { position: addForm.position.trim() }),
                    ...(addForm.image?.trim() && { image: addForm.image.trim() }),
                });
                toast({
                    title: "Representative Added",
                    description: `${addForm.name} has been added to payam representatives.`,
                });
            } catch (error) {
                toast({
                    title: "Add failed",
                    description: error instanceof Error ? error.message : "Failed to add representative.",
                    variant: "destructive",
                });
                return;
            }
        }

        setAddForm({
            name: "",
            position: "",
            description: "",
            type: "executive",
            payam: "",
            color: "from-[hsl(var(--brand-primary-500))] to-[hsl(var(--brand-secondary-500))]",
            icon: "UserCircle",
            image: "",
        });
        setIsAddDialogOpen(false);
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Leadership Management</h1>
                        <p className="text-muted-foreground">Manage executive committee and payam representatives</p>
                    </div>
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Member
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add Leadership Member</DialogTitle>
                                <DialogDescription>Add a new member to the leadership team</DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleAdd}>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="memberType">Member Type *</Label>
                                        <select
                                            id="memberType"
                                            title="Member Type"
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                            value={addForm.type}
                                            onChange={(e) => setAddForm({ ...addForm, type: e.target.value as "executive" | "payam" })}
                                        >
                                            <option value="executive">Executive Committee</option>
                                            <option value="payam">Payam Representative</option>
                                        </select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Name *</Label>
                                        <Input
                                            id="name"
                                            placeholder="Full name"
                                            value={addForm.name}
                                            onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    {addForm.type === "executive" ? (
                                        <>
                                            <div className="grid gap-2">
                                                <Label htmlFor="position">Position *</Label>
                                                <Input
                                                    id="position"
                                                    placeholder="e.g., Chairlady, Secretary General"
                                                    value={addForm.position}
                                                    onChange={(e) => setAddForm({ ...addForm, position: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="icon">Icon</Label>
                                                <select
                                                    id="icon"
                                                    title="Icon"
                                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                                    value={addForm.icon}
                                                    onChange={(e) => setAddForm({ ...addForm, icon: e.target.value })}
                                                >
                                                    {Object.keys(iconMap).map((k) => (
                                                        <option key={k} value={k}>{k}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="image">Image URL (optional)</Label>
                                                <Input
                                                    id="image"
                                                    placeholder="https://..."
                                                    value={addForm.image}
                                                    onChange={(e) => setAddForm({ ...addForm, image: e.target.value })}
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="description">Description</Label>
                                                <Textarea
                                                    id="description"
                                                    placeholder="Role description"
                                                    value={addForm.description}
                                                    onChange={(e) => setAddForm({ ...addForm, description: e.target.value })}
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="grid gap-2">
                                                <Label htmlFor="payam">Payam *</Label>
                                                <Input
                                                    id="payam"
                                                    placeholder="e.g., Ajuong, Kongor, Lith"
                                                    value={addForm.payam}
                                                    onChange={(e) => setAddForm({ ...addForm, payam: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="payamTitle">Title (optional)</Label>
                                                <Input
                                                    id="payamTitle"
                                                    placeholder="e.g., Chairlady of Kongor First Class"
                                                    value={addForm.position}
                                                    onChange={(e) => setAddForm({ ...addForm, position: e.target.value })}
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="payamImage">Image URL (optional)</Label>
                                                <Input
                                                    id="payamImage"
                                                    placeholder="https://..."
                                                    value={addForm.image}
                                                    onChange={(e) => setAddForm({ ...addForm, image: e.target.value })}
                                                />
                                            </div>
                                        </>
                                    )}
                                </div>
                                <DialogFooter>
                                    <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit">Add Member</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Executive Committee */}
                <Card>
                    <CardHeader>
                        <CardTitle>Executive Committee</CardTitle>
                        <CardDescription>Manage executive committee members</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {sortedExecutiveCommittee.map((member) => {
                                const Icon = member.icon && iconMap[member.icon] ? iconMap[member.icon] : UserCircle;
                                const imageUrl = member.image ?? staticExecutive.find((s) => s.name === member.name)?.image;
                                return (
                                    <div
                                        key={member.id}
                                        className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md"
                                    >
                                        <div className="mb-4 flex items-start justify-between gap-3">
                                            <div className="flex h-14 w-14 flex-shrink-0 overflow-hidden rounded-full border-2 border-border bg-muted">
                                                {imageUrl ? (
                                                    <img
                                                        src={imageUrl}
                                                        alt={member.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[hsl(var(--brand-primary-500))] to-[hsl(var(--brand-secondary-500))]">
                                                        <Icon className="h-6 w-6 text-white" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex gap-2 flex-shrink-0">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-8 w-8 p-0"
                                                    onClick={() => handleEdit(member.id, "executive")}
                                                >
                                                    <Edit className="h-4 w-4 text-[hsl(var(--brand-primary-600))]" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-8 w-8 p-0 text-[hsl(var(--brand-feminine-600))]"
                                                    onClick={() => handleDelete(member.id, "executive", member.name)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                        <h3 className="mb-1 font-semibold">{member.name}</h3>
                                        <p className="mb-2 text-sm text-muted-foreground">{displayPosition(member.position)}</p>
                                        <p className="text-xs text-muted-foreground">{member.description}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Payam Representatives */}
                <Card>
                    <CardHeader>
                        <CardTitle>Payam Representatives</CardTitle>
                        <CardDescription>Manage representatives from all 6 Payams</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {payamRepresentatives.map((rep) => {
                                const staticRep = staticPayam.find((s) => s.payam === rep.payam);
                                const displayName = rep.name || staticRep?.name || "";
                                const displayPosition = rep.position ?? staticRep?.position;
                                const imageUrl = rep.image ?? staticRep?.image;
                                return (
                                <div
                                    key={rep.id}
                                    className="group rounded-lg border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-3 flex-1">
                                            {imageUrl ? (
                                                <img
                                                    src={imageUrl}
                                                    alt={displayName}
                                                    className="h-12 w-12 flex-shrink-0 rounded-full object-cover border border-border"
                                                />
                                            ) : (
                                                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[hsl(var(--brand-primary-100))]">
                                                    <MapPin className="h-5 w-5 text-[hsl(var(--brand-primary-600))]" />
                                                </div>
                                            )}
                                            <div className="flex-1">
                                                <h3 className="mb-1 font-semibold">{displayName}</h3>
                                                <p className="text-sm text-muted-foreground">{rep.payam} Payam</p>
                                                {displayPosition && (
                                                    <p className="text-xs text-muted-foreground mt-0.5">{displayPosition}</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="h-8 w-8 p-0"
                                                onClick={() => handleEdit(rep.id, "payam")}
                                            >
                                                <Edit className="h-4 w-4 text-[hsl(var(--brand-primary-600))]" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="h-8 w-8 p-0 text-[hsl(var(--brand-feminine-600))]"
                                                onClick={() => handleDelete(rep.id, "payam", displayName)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Edit Dialog */}
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                Edit {editingMember?.type === "executive" ? "Executive Member" : "Payam Representative"}
                            </DialogTitle>
                            <DialogDescription>
                                Update the details for this leadership member
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSaveEdit}>
                            <div className="grid gap-4 py-4">
                                {editingMember?.type === "executive" ? (
                                    <>
                                        <div className="grid gap-2">
                                            <Label htmlFor="editName">Name *</Label>
                                            <Input
                                                id="editName"
                                                placeholder="Full name"
                                                value={editForm.name}
                                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="editPosition">Position *</Label>
                                            <Input
                                                id="editPosition"
                                                placeholder="e.g., Chairlady, Secretary General"
                                                value={editForm.position}
                                                onChange={(e) => setEditForm({ ...editForm, position: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="editIcon">Icon</Label>
                                            <select
                                                id="editIcon"
                                                title="Icon"
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                                value={editForm.icon}
                                                onChange={(e) => setEditForm({ ...editForm, icon: e.target.value })}
                                            >
                                                {Object.keys(iconMap).map((k) => (
                                                    <option key={k} value={k}>{k}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="editImage">Image URL (optional)</Label>
                                            <Input
                                                id="editImage"
                                                placeholder="https://..."
                                                value={editForm.image}
                                                onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="editDescription">Description</Label>
                                            <Textarea
                                                id="editDescription"
                                                placeholder="Role description"
                                                value={editForm.description}
                                                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="editColor">Color Gradient</Label>
                                            <Input
                                                id="editColor"
                                                placeholder="e.g., from-purple-500 to-pink-500"
                                                value={editForm.color}
                                                onChange={(e) => setEditForm({ ...editForm, color: e.target.value })}
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="grid gap-2">
                                            <Label htmlFor="editRepName">Name *</Label>
                                            <Input
                                                id="editRepName"
                                                placeholder="Full name"
                                                value={editForm.name}
                                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="editPayam">Payam *</Label>
                                            <Input
                                                id="editPayam"
                                                placeholder="e.g., Ajuong, Kongor, Lith"
                                                value={editForm.payam}
                                                onChange={(e) => setEditForm({ ...editForm, payam: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="editRepPosition">Title (optional)</Label>
                                            <Input
                                                id="editRepPosition"
                                                placeholder="e.g., Chairlady of Kongor First Class"
                                                value={editForm.position}
                                                onChange={(e) => setEditForm({ ...editForm, position: e.target.value })}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="editPayamImage">Image URL (optional)</Label>
                                            <Input
                                                id="editPayamImage"
                                                placeholder="https://..."
                                                value={editForm.image}
                                                onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit">Save Changes</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
};

export default Leadership;

