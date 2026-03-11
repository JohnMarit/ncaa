import { useState } from "react";
import { GraduationCap, Plus, Edit, Trash2, ExternalLink, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useToast } from "@/hooks/use-toast";
import { useAdminData } from "@/contexts/AdminDataContext";
import type {
    AdminScholarship,
    ScholarshipFormField,
    ScholarshipFormFieldType,
    ScholarProfile,
} from "@/contexts/AdminDataContext";
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
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const Scholarships = () => {
    const { toast } = useToast();
    const {
        scholarships,
        scholars,
        addScholarship,
        updateScholarship,
        deleteScholarship,
        addScholarProfile,
        updateScholarProfile,
        deleteScholarProfile,
    } = useAdminData();
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState({
        title: "",
        description: "",
        applicationLink: "",
    });
    const [formFieldsEnabled, setFormFieldsEnabled] = useState(false);
    const [formFields, setFormFields] = useState<ScholarshipFormField[]>([]);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    const [isScholarDialogOpen, setIsScholarDialogOpen] = useState(false);
    const [editingScholarId, setEditingScholarId] = useState<string | null>(null);
    const [scholarForm, setScholarForm] = useState({
        name: "",
        tagline: "",
        photoUrl: "",
        story: "",
        featured: true as boolean,
    });
    const [scholarErrors, setScholarErrors] = useState<Record<string, string>>({});

    const addField = () => {
        const newField: ScholarshipFormField = {
            id: crypto.randomUUID(),
            label: "",
            type: "text",
            required: false,
        };
        setFormFields((prev) => [...prev, newField]);
    };

    const updateField = (id: string, updates: Partial<ScholarshipFormField>) => {
        setFormFields((prev) => prev.map((f) => (f.id === id ? { ...f, ...updates } : f)));
    };

    const removeField = (id: string) => {
        setFormFields((prev) => prev.filter((f) => f.id !== id));
    };

    const validate = () => {
        const err: Record<string, string> = {};
        if (!form.title.trim()) err.title = "Title is required.";
        if (!form.description.trim()) err.description = "Description is required.";
        if (!form.applicationLink.trim()) err.applicationLink = "Application link is required.";
        else {
            try {
                new URL(form.applicationLink.trim());
            } catch {
                err.applicationLink = "Please enter a valid URL.";
            }
        }

        if (formFieldsEnabled) {
            const hasAny = formFields.length > 0;
            if (!hasAny) err.formFields = "Add at least one field or disable the form builder.";

            formFields.forEach((f, idx) => {
                if (!f.label.trim()) err[`field_${idx}_label`] = "Field label is required.";
                if (f.type === "select") {
                    const opts = Array.isArray(f.options) ? f.options.filter((o) => o.trim().length > 0) : [];
                    if (opts.length === 0) err[`field_${idx}_options`] = "Select fields require at least one option.";
                }
            });
        }

        setFormErrors(err);
        return Object.keys(err).length === 0;
    };

    const validateScholar = () => {
        const err: Record<string, string> = {};
        if (!scholarForm.name.trim()) err.name = "Name is required.";
        if (!scholarForm.story.trim()) err.story = "Story is required.";
        const url = scholarForm.photoUrl.trim();
        if (url.length > 0) {
            try {
                new URL(url);
            } catch {
                err.photoUrl = "Please enter a valid image URL.";
            }
        }
        setScholarErrors(err);
        return Object.keys(err).length === 0;
    };

    const resetForm = () => {
        setForm({ title: "", description: "", applicationLink: "" });
        setFormFieldsEnabled(false);
        setFormFields([]);
        setFormErrors({});
    };

    const resetScholarForm = () => {
        setScholarForm({
            name: "",
            tagline: "",
            photoUrl: "",
            story: "",
            featured: true,
        });
        setScholarErrors({});
        setEditingScholarId(null);
    };

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) {
            toast({
                title: "Validation Error",
                description: "Please fill in all required fields correctly.",
                variant: "destructive",
            });
            return;
        }
        addScholarship({
            title: form.title.trim(),
            description: form.description.trim(),
            applicationLink: form.applicationLink.trim(),
            ...(formFieldsEnabled && { formFields }),
        });
        toast({
            title: "Scholarship Posted",
            description: "The scholarship opportunity has been added and is visible on the public site.",
        });
        resetForm();
        setIsCreateDialogOpen(false);
    };

    const handleEditClick = (s: AdminScholarship) => {
        setForm({
            title: s.title,
            description: s.description,
            applicationLink: s.applicationLink,
        });
        const nextFields = Array.isArray(s.formFields) ? s.formFields : [];
        setFormFieldsEnabled(nextFields.length > 0);
        setFormFields(nextFields);
        setFormErrors({});
        setEditingId(s.id);
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingId || !validate()) {
            if (!editingId) return;
            toast({
                title: "Validation Error",
                description: "Please fill in all required fields correctly.",
                variant: "destructive",
            });
            return;
        }
        updateScholarship(editingId, {
            title: form.title.trim(),
            description: form.description.trim(),
            applicationLink: form.applicationLink.trim(),
            formFields: formFieldsEnabled ? formFields : undefined,
        });
        toast({
            title: "Scholarship Updated",
            description: "Changes are saved and will reflect on the website.",
        });
        resetForm();
        setEditingId(null);
    };

    const handleDelete = (id: string, title: string) => {
        if (!confirm(`Remove scholarship "${title}"? It will no longer appear on the public site.`)) return;
        deleteScholarship(id);
        toast({
            title: "Scholarship Removed",
            description: "The scholarship post has been deleted.",
        });
    };

    const handleScholarSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateScholar()) {
            toast({
                title: "Validation Error",
                description: "Please fix the highlighted scholar fields.",
                variant: "destructive",
            });
            return;
        }

        try {
            if (editingScholarId) {
                await updateScholarProfile(editingScholarId, {
                    name: scholarForm.name.trim(),
                    tagline: scholarForm.tagline.trim() || undefined,
                    photoUrl: scholarForm.photoUrl.trim() || undefined,
                    story: scholarForm.story.trim(),
                    featured: scholarForm.featured,
                });
                toast({
                    title: "Scholar Updated",
                    description: "The scholar profile has been updated.",
                });
            } else {
                await addScholarProfile({
                    name: scholarForm.name.trim(),
                    tagline: scholarForm.tagline.trim() || undefined,
                    photoUrl: scholarForm.photoUrl.trim() || undefined,
                    story: scholarForm.story.trim(),
                    featured: scholarForm.featured,
                });
                toast({
                    title: "Scholar Added",
                    description: "The scholar profile is now visible on the Scholarship page.",
                });
            }
            resetScholarForm();
            setIsScholarDialogOpen(false);
        } catch {
            toast({
                title: "Error",
                description: "Unable to save scholar profile. Please try again.",
                variant: "destructive",
            });
        }
    };

    const handleScholarEditClick = (s: ScholarProfile) => {
        setScholarForm({
            name: s.name,
            tagline: s.tagline ?? "",
            photoUrl: s.photoUrl ?? "",
            story: s.story,
            featured: s.featured ?? true,
        });
        setScholarErrors({});
        setEditingScholarId(s.id);
        setIsScholarDialogOpen(true);
    };

    const handleScholarDelete = async (id: string, name: string) => {
        if (!confirm(`Remove scholar profile for "${name}"? This will hide her story from the site.`)) return;
        try {
            await deleteScholarProfile(id);
            toast({
                title: "Scholar Removed",
                description: "The scholar profile has been deleted.",
            });
        } catch {
            toast({
                title: "Error",
                description: "Unable to delete scholar profile. Please try again.",
                variant: "destructive",
            });
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Scholarship Management</h1>
                        <p className="text-muted-foreground">Create and manage scholarship posts. Each post appears on the public Scholarship page with an apply link.</p>
                    </div>
                    <Dialog open={isCreateDialogOpen} onOpenChange={(open) => { setIsCreateDialogOpen(open); if (!open) resetForm(); setFormErrors({}); }}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Create Scholarship Post
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg">
                            <DialogHeader>
                                <DialogTitle>Create Scholarship Post</DialogTitle>
                                <DialogDescription>Add a new scholarship opportunity. The application link will be shown on the public Scholarship page.</DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleCreate}>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="create-title">Title *</Label>
                                        <Input
                                            id="create-title"
                                            placeholder="e.g. Primary School Scholarship 2025"
                                            value={form.title}
                                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                                            className={formErrors.title ? "border-destructive" : ""}
                                        />
                                        {formErrors.title && <p className="text-sm text-destructive">{formErrors.title}</p>}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="create-description">Description *</Label>
                                        <Textarea
                                            id="create-description"
                                            placeholder="Describe the scholarship, eligibility, and coverage."
                                            rows={4}
                                            value={form.description}
                                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                                            className={formErrors.description ? "border-destructive" : ""}
                                        />
                                        {formErrors.description && <p className="text-sm text-destructive">{formErrors.description}</p>}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="create-link">Application Link *</Label>
                                        <Input
                                            id="create-link"
                                            type="url"
                                            placeholder="https://..."
                                            value={form.applicationLink}
                                            onChange={(e) => setForm({ ...form, applicationLink: e.target.value })}
                                            className={formErrors.applicationLink ? "border-destructive" : ""}
                                        />
                                        {formErrors.applicationLink && <p className="text-sm text-destructive">{formErrors.applicationLink}</p>}
                                    </div>

                                    <div className="rounded-lg border border-border p-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label htmlFor="create-form-fields">Applicant Form Builder</Label>
                                                <p className="text-sm text-muted-foreground">Define what information applicants must provide for this scholarship.</p>
                                            </div>
                                            <Switch
                                                id="create-form-fields"
                                                checked={formFieldsEnabled}
                                                onCheckedChange={(checked) => {
                                                    setFormFieldsEnabled(checked);
                                                    if (!checked) setFormFields([]);
                                                }}
                                            />
                                        </div>

                                        {formFieldsEnabled && (
                                            <div className="mt-4 space-y-4">
                                                {formErrors.formFields && (
                                                    <p className="text-sm text-destructive">{formErrors.formFields}</p>
                                                )}

                                                {formFields.map((field, idx) => (
                                                    <div key={field.id} className="rounded-md border border-border p-3">
                                                        <div className="grid gap-3 md:grid-cols-2">
                                                            <div className="grid gap-2">
                                                                <Label>Field Label *</Label>
                                                                <Input
                                                                    value={field.label}
                                                                    onChange={(e) => updateField(field.id, { label: e.target.value })}
                                                                    className={formErrors[`field_${idx}_label`] ? "border-destructive" : ""}
                                                                />
                                                                {formErrors[`field_${idx}_label`] && (
                                                                    <p className="text-sm text-destructive">{formErrors[`field_${idx}_label`]}</p>
                                                                )}
                                                            </div>

                                                            <div className="grid gap-2">
                                                                <Label>Field Type</Label>
                                                                <Select
                                                                    value={field.type}
                                                                    onValueChange={(value) =>
                                                                        updateField(field.id, {
                                                                            type: value as ScholarshipFormFieldType,
                                                                            ...(value === "select" ? {} : { options: undefined }),
                                                                        })
                                                                    }
                                                                >
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Select type" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="text">Text</SelectItem>
                                                                        <SelectItem value="textarea">Long Text</SelectItem>
                                                                        <SelectItem value="email">Email</SelectItem>
                                                                        <SelectItem value="tel">Phone</SelectItem>
                                                                        <SelectItem value="number">Number</SelectItem>
                                                                        <SelectItem value="select">Select</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                        </div>

                                                        {field.type === "select" && (
                                                            <div className="mt-3 grid gap-2">
                                                                <Label>Options (comma-separated) *</Label>
                                                                <Input
                                                                    value={(Array.isArray(field.options) ? field.options : []).join(", ")}
                                                                    onChange={(e) =>
                                                                        updateField(field.id, {
                                                                            options: e.target.value
                                                                                .split(",")
                                                                                .map((s) => s.trim())
                                                                                .filter((s) => s.length > 0),
                                                                        })
                                                                    }
                                                                    className={formErrors[`field_${idx}_options`] ? "border-destructive" : ""}
                                                                />
                                                                {formErrors[`field_${idx}_options`] && (
                                                                    <p className="text-sm text-destructive">{formErrors[`field_${idx}_options`]}</p>
                                                                )}
                                                            </div>
                                                        )}

                                                        <div className="mt-3 flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <Switch
                                                                    checked={field.required ?? false}
                                                                    onCheckedChange={(checked) => updateField(field.id, { required: checked })}
                                                                    id={`required-${field.id}`}
                                                                />
                                                                <Label htmlFor={`required-${field.id}`}>Required</Label>
                                                            </div>
                                                            <Button type="button" variant="ghost" onClick={() => removeField(field.id)}>
                                                                Remove
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))}

                                                <Button type="button" variant="outline" onClick={addField}>
                                                    <Plus className="mr-2 h-4 w-4" />
                                                    Add Field
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
                                    <Button type="submit">Create Post</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Scholarship Posts</CardTitle>
                        <CardDescription>These posts are shown on the public Scholarship page. Visitors can click the apply link to open the application.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {scholarships.length === 0 ? (
                            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-12 text-center">
                                <GraduationCap className="mb-4 h-12 w-12 text-muted-foreground" />
                                <p className="text-muted-foreground">No scholarship posts yet.</p>
                                <p className="mt-1 text-sm text-muted-foreground">Create one to show on the public Scholarship page.</p>
                                <Button className="mt-4" variant="outline" onClick={() => setIsCreateDialogOpen(true)}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create Scholarship Post
                                </Button>
                            </div>
                        ) : (
                            <div className="overflow-x-auto -mx-1">
                                <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Title</TableHead>
                                        <TableHead className="max-w-[280px]">Description</TableHead>
                                        <TableHead>Application Link</TableHead>
                                        <TableHead className="w-[100px] text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {scholarships.map((s) => (
                                        <TableRow key={s.id}>
                                            <TableCell className="font-medium">{s.title}</TableCell>
                                            <TableCell className="max-w-[280px] truncate text-muted-foreground">{s.description}</TableCell>
                                            <TableCell>
                                                <a
                                                    href={s.applicationLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 text-primary hover:underline text-sm"
                                                >
                                                    Apply <ExternalLink className="h-3.5 w-3.5" />
                                                </a>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => handleEditClick(s)} aria-label={`Edit ${s.title}`}>
                                                        <Edit className="h-4 w-4 text-[hsl(var(--brand-primary-600))]" />
                                                    </Button>
                                                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-[hsl(var(--brand-feminine-600))]" onClick={() => handleDelete(s.id, s.title)} aria-label={`Delete ${s.title}`}>
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

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <CardTitle>Featured Scholars</CardTitle>
                                <CardDescription>
                                    Manage profiles of girls currently sponsored by NCAA. These appear on the public Scholarship page with a "Read my story" button.
                                </CardDescription>
                            </div>
                            <Dialog
                                open={isScholarDialogOpen}
                                onOpenChange={(open) => {
                                    setIsScholarDialogOpen(open);
                                    if (!open) resetScholarForm();
                                }}
                            >
                                <DialogTrigger asChild>
                                    <Button>
                                        <Plus className="mr-2 h-4 w-4" />
                                        {editingScholarId ? "Edit Scholar" : "Add Scholar"}
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-lg">
                                    <DialogHeader>
                                        <DialogTitle>{editingScholarId ? "Edit Scholar Profile" : "Add Scholar Profile"}</DialogTitle>
                                        <DialogDescription>
                                            Share the stories of sponsored girls with our community and donors.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={handleScholarSubmit}>
                                        <div className="grid gap-4 py-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="scholar-name">Name *</Label>
                                                <Input
                                                    id="scholar-name"
                                                    placeholder="e.g. Nyandeng Alek"
                                                    value={scholarForm.name}
                                                    onChange={(e) => setScholarForm({ ...scholarForm, name: e.target.value })}
                                                    className={scholarErrors.name ? "border-destructive" : ""}
                                                />
                                                {scholarErrors.name && <p className="text-sm text-destructive">{scholarErrors.name}</p>}
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="scholar-tagline">Tagline</Label>
                                                <Input
                                                    id="scholar-tagline"
                                                    placeholder="e.g. Secondary student, aspiring nurse"
                                                    value={scholarForm.tagline}
                                                    onChange={(e) => setScholarForm({ ...scholarForm, tagline: e.target.value })}
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="scholar-photo">Photo URL</Label>
                                                <Input
                                                    id="scholar-photo"
                                                    placeholder="https://..."
                                                    value={scholarForm.photoUrl}
                                                    onChange={(e) => setScholarForm({ ...scholarForm, photoUrl: e.target.value })}
                                                    className={scholarErrors.photoUrl ? "border-destructive" : ""}
                                                />
                                                {scholarErrors.photoUrl && (
                                                    <p className="text-sm text-destructive">{scholarErrors.photoUrl}</p>
                                                )}
                                                <p className="text-xs text-muted-foreground">
                                                    Use a square image for best results. You can paste a link from Firebase Storage or another secure host.
                                                </p>
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="scholar-story">Story *</Label>
                                                <Textarea
                                                    id="scholar-story"
                                                    rows={6}
                                                    placeholder="Write her story, background, and how the scholarship is impacting her life."
                                                    value={scholarForm.story}
                                                    onChange={(e) => setScholarForm({ ...scholarForm, story: e.target.value })}
                                                    className={scholarErrors.story ? "border-destructive" : ""}
                                                />
                                                {scholarErrors.story && <p className="text-sm text-destructive">{scholarErrors.story}</p>}
                                            </div>
                                            <div className="flex items-center justify-between rounded-md border border-border p-3">
                                                <div className="space-y-1">
                                                    <Label htmlFor="scholar-featured">Feature on Scholarship page</Label>
                                                    <p className="text-xs text-muted-foreground">
                                                        Featured scholars appear first in the public list.
                                                    </p>
                                                </div>
                                                <Switch
                                                    id="scholar-featured"
                                                    checked={scholarForm.featured}
                                                    onCheckedChange={(checked) =>
                                                        setScholarForm({ ...scholarForm, featured: checked })
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => {
                                                    setIsScholarDialogOpen(false);
                                                    resetScholarForm();
                                                }}
                                            >
                                                Cancel
                                            </Button>
                                            <Button type="submit">
                                                {editingScholarId ? "Save Changes" : "Create Profile"}
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {scholars.length === 0 ? (
                            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-10 text-center">
                                <GraduationCap className="mb-4 h-10 w-10 text-muted-foreground" />
                                <p className="font-medium">No scholar profiles yet.</p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Highlight the stories of sponsored girls to inspire members and donors.
                                </p>
                                <Button
                                    className="mt-4"
                                    variant="outline"
                                    onClick={() => {
                                        resetScholarForm();
                                        setIsScholarDialogOpen(true);
                                    }}
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Scholar Profile
                                </Button>
                            </div>
                        ) : (
                            <div className="overflow-x-auto -mx-1">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Scholar</TableHead>
                                            <TableHead className="max-w-[260px]">Tagline</TableHead>
                                            <TableHead>Featured</TableHead>
                                            <TableHead className="w-[100px] text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {scholars.map((s) => (
                                            <TableRow key={s.id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        {s.photoUrl ? (
                                                            <img
                                                                src={s.photoUrl}
                                                                alt={s.name}
                                                                className="h-10 w-10 rounded-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                                                                {s.name
                                                                    .split(" ")
                                                                    .map((part) => part[0])
                                                                    .join("")
                                                                    .slice(0, 2)
                                                                    .toUpperCase()}
                                                            </div>
                                                        )}
                                                        <div>
                                                            <p className="font-medium">{s.name}</p>
                                                            {s.createdAt && (
                                                                <p className="text-xs text-muted-foreground">
                                                                    Added {new Date(s.createdAt).toLocaleDateString()}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="max-w-[260px] truncate text-muted-foreground">
                                                    {s.tagline}
                                                </TableCell>
                                                <TableCell>
                                                    {s.featured ? (
                                                        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                                                            <CheckCircle className="h-3 w-3" />
                                                            Featured
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                                                            <Clock className="h-3 w-3" />
                                                            Standard
                                                        </span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="h-8 w-8 p-0"
                                                            onClick={() => handleScholarEditClick(s)}
                                                            aria-label={`Edit ${s.name}`}
                                                        >
                                                            <Edit className="h-4 w-4 text-[hsl(var(--brand-primary-600))]" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="h-8 w-8 p-0 text-[hsl(var(--brand-feminine-600))]"
                                                            onClick={() => handleScholarDelete(s.id, s.name)}
                                                            aria-label={`Delete ${s.name}`}
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

                {/* Edit Dialog */}
                <Dialog open={editingId !== null} onOpenChange={(open) => { if (!open) { setEditingId(null); resetForm(); setFormErrors({}); } }}>
                    <DialogContent className="max-w-lg">
                        <DialogHeader>
                            <DialogTitle>Edit Scholarship Post</DialogTitle>
                            <DialogDescription>Update the title, description, or application link.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleUpdate}>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-title">Title *</Label>
                                    <Input
                                        id="edit-title"
                                        placeholder="e.g. Primary School Scholarship 2025"
                                        value={form.title}
                                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                                        className={formErrors.title ? "border-destructive" : ""}
                                    />
                                    {formErrors.title && <p className="text-sm text-destructive">{formErrors.title}</p>}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-description">Description *</Label>
                                    <Textarea
                                        id="edit-description"
                                        placeholder="Describe the scholarship, eligibility, and coverage."
                                        rows={4}
                                        value={form.description}
                                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                                        className={formErrors.description ? "border-destructive" : ""}
                                    />
                                    {formErrors.description && <p className="text-sm text-destructive">{formErrors.description}</p>}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-link">Application Link *</Label>
                                    <Input
                                        id="edit-link"
                                        type="url"
                                        placeholder="https://..."
                                        value={form.applicationLink}
                                        onChange={(e) => setForm({ ...form, applicationLink: e.target.value })}
                                        className={formErrors.applicationLink ? "border-destructive" : ""}
                                    />
                                    {formErrors.applicationLink && <p className="text-sm text-destructive">{formErrors.applicationLink}</p>}
                                </div>

                                <div className="rounded-lg border border-border p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label htmlFor="edit-form-fields">Applicant Form Builder</Label>
                                            <p className="text-sm text-muted-foreground">Define what information applicants must provide for this scholarship.</p>
                                        </div>
                                        <Switch
                                            id="edit-form-fields"
                                            checked={formFieldsEnabled}
                                            onCheckedChange={(checked) => {
                                                setFormFieldsEnabled(checked);
                                                if (!checked) setFormFields([]);
                                            }}
                                        />
                                    </div>

                                    {formFieldsEnabled && (
                                        <div className="mt-4 space-y-4">
                                            {formErrors.formFields && (
                                                <p className="text-sm text-destructive">{formErrors.formFields}</p>
                                            )}

                                            {formFields.map((field, idx) => (
                                                <div key={field.id} className="rounded-md border border-border p-3">
                                                    <div className="grid gap-3 md:grid-cols-2">
                                                        <div className="grid gap-2">
                                                            <Label>Field Label *</Label>
                                                            <Input
                                                                value={field.label}
                                                                onChange={(e) => updateField(field.id, { label: e.target.value })}
                                                                className={formErrors[`field_${idx}_label`] ? "border-destructive" : ""}
                                                            />
                                                            {formErrors[`field_${idx}_label`] && (
                                                                <p className="text-sm text-destructive">{formErrors[`field_${idx}_label`]}</p>
                                                            )}
                                                        </div>

                                                        <div className="grid gap-2">
                                                            <Label>Field Type</Label>
                                                            <Select
                                                                value={field.type}
                                                                onValueChange={(value) =>
                                                                    updateField(field.id, {
                                                                        type: value as ScholarshipFormFieldType,
                                                                        ...(value === "select" ? {} : { options: undefined }),
                                                                    })
                                                                }
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select type" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="text">Text</SelectItem>
                                                                    <SelectItem value="textarea">Long Text</SelectItem>
                                                                    <SelectItem value="email">Email</SelectItem>
                                                                    <SelectItem value="tel">Phone</SelectItem>
                                                                    <SelectItem value="number">Number</SelectItem>
                                                                    <SelectItem value="select">Select</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    </div>

                                                    {field.type === "select" && (
                                                        <div className="mt-3 grid gap-2">
                                                            <Label>Options (comma-separated) *</Label>
                                                            <Input
                                                                value={(Array.isArray(field.options) ? field.options : []).join(", ")}
                                                                onChange={(e) =>
                                                                    updateField(field.id, {
                                                                        options: e.target.value
                                                                            .split(",")
                                                                            .map((s) => s.trim())
                                                                            .filter((s) => s.length > 0),
                                                                    })
                                                                }
                                                                className={formErrors[`field_${idx}_options`] ? "border-destructive" : ""}
                                                            />
                                                            {formErrors[`field_${idx}_options`] && (
                                                                <p className="text-sm text-destructive">{formErrors[`field_${idx}_options`]}</p>
                                                            )}
                                                        </div>
                                                    )}

                                                    <div className="mt-3 flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <Switch
                                                                checked={field.required ?? false}
                                                                onCheckedChange={(checked) => updateField(field.id, { required: checked })}
                                                                id={`edit-required-${field.id}`}
                                                            />
                                                            <Label htmlFor={`edit-required-${field.id}`}>Required</Label>
                                                        </div>
                                                        <Button type="button" variant="ghost" onClick={() => removeField(field.id)}>
                                                            Remove
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}

                                            <Button type="button" variant="outline" onClick={addField}>
                                                <Plus className="mr-2 h-4 w-4" />
                                                Add Field
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => { setEditingId(null); resetForm(); }}>Cancel</Button>
                                <Button type="submit">Save Changes</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
};

export default Scholarships;
