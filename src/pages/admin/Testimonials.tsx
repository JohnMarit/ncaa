import { useState } from "react";
import { MessageSquare, Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useToast } from "@/hooks/use-toast";
import { useAdminData } from "@/contexts/AdminDataContext";
import type { Testimonial } from "@/contexts/AdminDataContext";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

const emptyForm = { name: "", role: "", quote: "", photoUrl: "" };

const AdminTestimonials = () => {
    const { toast } = useToast();
    const { testimonials, addTestimonial, updateTestimonial, deleteTestimonial } = useAdminData();

    const [isOpen, setIsOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const err: Record<string, string> = {};
        if (!form.name.trim()) err.name = "Name is required.";
        if (!form.role.trim()) err.role = "Role is required.";
        if (!form.quote.trim()) err.quote = "Quote is required.";
        if (form.photoUrl.trim()) {
            try {
                new URL(form.photoUrl.trim());
            } catch {
                err.photoUrl = "Please enter a valid URL.";
            }
        }
        setErrors(err);
        return Object.keys(err).length === 0;
    };

    const reset = () => {
        setForm(emptyForm);
        setErrors({});
        setEditingId(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) {
            toast({ title: "Validation Error", description: "Please fix the errors.", variant: "destructive" });
            return;
        }
        try {
            const data = {
                name: form.name.trim(),
                role: form.role.trim(),
                quote: form.quote.trim(),
                photoUrl: form.photoUrl.trim() || undefined,
            };
            if (editingId) {
                await updateTestimonial(editingId, data);
                toast({ title: "Testimonial Updated", description: "Changes saved." });
            } else {
                await addTestimonial(data);
                toast({ title: "Testimonial Added", description: "It will appear on the landing page." });
            }
            reset();
            setIsOpen(false);
        } catch {
            toast({ title: "Error", description: "Could not save. Please try again.", variant: "destructive" });
        }
    };

    const handleEdit = (t: Testimonial) => {
        setForm({ name: t.name, role: t.role, quote: t.quote, photoUrl: t.photoUrl ?? "" });
        setErrors({});
        setEditingId(t.id);
        setIsOpen(true);
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Remove testimonial from "${name}"?`)) return;
        try {
            await deleteTestimonial(id);
            toast({ title: "Removed", description: "Testimonial deleted." });
        } catch {
            toast({ title: "Error", description: "Could not delete.", variant: "destructive" });
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Testimonials</h1>
                        <p className="text-muted-foreground">
                            Manage quotes that scroll on the landing page. Add a photo, name, role, and quote for each person.
                        </p>
                    </div>
                    <Dialog
                        open={isOpen}
                        onOpenChange={(open) => { setIsOpen(open); if (!open) reset(); }}
                    >
                        <DialogTrigger asChild>
                            <Button><Plus className="mr-2 h-4 w-4" />Add Testimonial</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg">
                            <DialogHeader>
                                <DialogTitle>{editingId ? "Edit Testimonial" : "Add Testimonial"}</DialogTitle>
                                <DialogDescription>
                                    This will appear on the homepage in the scrolling testimonials strip.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSubmit}>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="t-name">Name *</Label>
                                        <Input
                                            id="t-name"
                                            placeholder="e.g. Nyandeng A."
                                            value={form.name}
                                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                                            className={errors.name ? "border-destructive" : ""}
                                        />
                                        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="t-role">Role / Title *</Label>
                                        <Input
                                            id="t-role"
                                            placeholder="e.g. Secondary school student, Bor"
                                            value={form.role}
                                            onChange={(e) => setForm({ ...form, role: e.target.value })}
                                            className={errors.role ? "border-destructive" : ""}
                                        />
                                        {errors.role && <p className="text-sm text-destructive">{errors.role}</p>}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="t-photo">Photo URL</Label>
                                        <Input
                                            id="t-photo"
                                            placeholder="https://..."
                                            value={form.photoUrl}
                                            onChange={(e) => setForm({ ...form, photoUrl: e.target.value })}
                                            className={errors.photoUrl ? "border-destructive" : ""}
                                        />
                                        {errors.photoUrl && <p className="text-sm text-destructive">{errors.photoUrl}</p>}
                                        <p className="text-xs text-muted-foreground">
                                            Square photos work best. Leave blank for initials avatar.
                                        </p>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="t-quote">Quote *</Label>
                                        <Textarea
                                            id="t-quote"
                                            rows={4}
                                            placeholder="What they said about NCAA..."
                                            value={form.quote}
                                            onChange={(e) => setForm({ ...form, quote: e.target.value })}
                                            className={errors.quote ? "border-destructive" : ""}
                                        />
                                        {errors.quote && <p className="text-sm text-destructive">{errors.quote}</p>}
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="button" variant="outline" onClick={() => { setIsOpen(false); reset(); }}>
                                        Cancel
                                    </Button>
                                    <Button type="submit">{editingId ? "Save Changes" : "Add"}</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>All Testimonials</CardTitle>
                        <CardDescription>These quotes scroll across the homepage. Add at least 4 for the best visual effect.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {testimonials.length === 0 ? (
                            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-12 text-center">
                                <MessageSquare className="mb-4 h-12 w-12 text-muted-foreground" />
                                <p className="font-medium">No testimonials yet.</p>
                                <p className="mt-1 text-sm text-muted-foreground">Add quotes from scholars, parents, or community members.</p>
                                <Button className="mt-4" variant="outline" onClick={() => { reset(); setIsOpen(true); }}>
                                    <Plus className="mr-2 h-4 w-4" />Add Testimonial
                                </Button>
                            </div>
                        ) : (
                            <div className="overflow-x-auto -mx-1">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Person</TableHead>
                                            <TableHead className="max-w-[320px]">Quote</TableHead>
                                            <TableHead className="w-[100px] text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {testimonials.map((t) => (
                                            <TableRow key={t.id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        {t.photoUrl ? (
                                                            <img src={t.photoUrl} alt={t.name} className="h-10 w-10 rounded-full object-cover" />
                                                        ) : (
                                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                                                                {t.name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase()}
                                                            </div>
                                                        )}
                                                        <div>
                                                            <p className="font-medium">{t.name}</p>
                                                            <p className="text-xs text-muted-foreground">{t.role}</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="max-w-[320px] truncate text-muted-foreground text-sm">
                                                    "{t.quote}"
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="h-8 w-8 p-0"
                                                            onClick={() => handleEdit(t)}
                                                            aria-label={`Edit ${t.name}`}
                                                        >
                                                            <Edit className="h-4 w-4 text-[hsl(var(--brand-primary-600))]" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="h-8 w-8 p-0 text-[hsl(var(--brand-feminine-600))]"
                                                            onClick={() => handleDelete(t.id, t.name)}
                                                            aria-label={`Delete ${t.name}`}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
};

export default AdminTestimonials;
