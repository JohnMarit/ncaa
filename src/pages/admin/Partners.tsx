import { useState } from "react";
import { Building2, Plus, Edit, Trash2 } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useToast } from "@/hooks/use-toast";
import { useAdminData } from "@/contexts/AdminDataContext";
import type { Partner } from "@/contexts/AdminDataContext";

const emptyForm = {
  name: "",
  description: "",
  logoUrl: "",
};

const AdminPartners = () => {
  const { toast } = useToast();
  const { partners, addPartner, updatePartner, deletePartner } = useAdminData();

  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const err: Record<string, string> = {};
    if (!form.name.trim()) err.name = "Name is required.";
    if (!form.description.trim()) err.description = "Description is required.";
    if (form.logoUrl.trim()) {
      try {
        new URL(form.logoUrl.trim());
      } catch {
        err.logoUrl = "Please enter a valid URL.";
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
      toast({
        title: "Validation Error",
        description: "Please fix the errors before saving.",
        variant: "destructive",
      });
      return;
    }
    try {
      const data = {
        name: form.name.trim(),
        description: form.description.trim(),
        logoUrl: form.logoUrl.trim() || undefined,
      };
      if (editingId) {
        await updatePartner(editingId, data);
        toast({ title: "Partner Updated", description: "Changes saved." });
      } else {
        await addPartner(data);
        toast({
          title: "Partner Added",
          description: "The logo will appear in the “Our Partners” section.",
        });
      }
      reset();
      setIsOpen(false);
    } catch {
      toast({
        title: "Error",
        description: "Could not save partner. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (p: Partner) => {
    setForm({
      name: p.name,
      description: p.description,
      logoUrl: p.logoUrl ?? "",
    });
    setErrors({});
    setEditingId(p.id);
    setIsOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Remove partner "${name}"?`)) return;
    try {
      await deletePartner(id);
      toast({ title: "Removed", description: "Partner removed." });
    } catch {
      toast({
        title: "Error",
        description: "Could not delete partner.",
        variant: "destructive",
      });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Partners</h1>
            <p className="text-muted-foreground">
              Add organisations and groups that stand with NCAA. You can upload their logo and a short description of
              how they support the work.
            </p>
          </div>
          <Dialog
            open={isOpen}
            onOpenChange={(open) => {
              setIsOpen(open);
              if (!open) reset();
            }}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Partner
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit Partner" : "Add Partner"}</DialogTitle>
                <DialogDescription>
                  Partners will appear on the homepage under “Our Partners” with their logo and description.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="p-name">Name *</Label>
                    <Input
                      id="p-name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. TEYA Institute"
                      className={errors.name ? "border-destructive" : ""}
                    />
                    {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="p-logo">Logo URL</Label>
                    <Input
                      id="p-logo"
                      value={form.logoUrl}
                      onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
                      placeholder="https://..."
                      className={errors.logoUrl ? "border-destructive" : ""}
                    />
                    {errors.logoUrl && <p className="text-sm text-destructive">{errors.logoUrl}</p>}
                    <p className="text-xs text-muted-foreground">
                      Transparent PNG or SVG logos work best. Leave blank to show initials only.
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="p-desc">Description *</Label>
                    <Textarea
                      id="p-desc"
                      rows={4}
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      placeholder="How this partner walks with NCAA…"
                      className={errors.description ? "border-destructive" : ""}
                    />
                    {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsOpen(false);
                      reset();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">{editingId ? "Save Changes" : "Add Partner"}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Partners</CardTitle>
            <CardDescription>
              Logos and descriptions here feed into the “Our Partners” section on the public site.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {partners.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-12 text-center">
                <Building2 className="mb-4 h-12 w-12 text-muted-foreground" />
                <p className="font-medium">No partners added yet.</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Add schools, institutes, churches, community groups and diaspora friends who stand with NCAA.
                </p>
                <Button
                  className="mt-4"
                  variant="outline"
                  onClick={() => {
                    reset();
                    setIsOpen(true);
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Partner
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto -mx-1">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Partner</TableHead>
                      <TableHead className="max-w-[360px]">Description</TableHead>
                      <TableHead className="w-[100px] text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {partners.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {p.logoUrl ? (
                              <img
                                src={p.logoUrl}
                                alt={p.name}
                                className="h-10 w-10 rounded-md object-contain bg-muted"
                              />
                            ) : (
                              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary/10 text-xs font-semibold text-secondary-foreground">
                                {p.name
                                  .split(" ")
                                  .map((part) => part[0])
                                  .join("")
                                  .slice(0, 3)
                                  .toUpperCase()}
                              </div>
                            )}
                            <div>
                              <p className="font-medium">{p.name}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[360px] truncate text-sm text-muted-foreground">
                          {p.description}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0"
                              onClick={() => handleEdit(p)}
                              aria-label={`Edit ${p.name}`}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 text-[hsl(var(--brand-feminine-600))]"
                              onClick={() => handleDelete(p.id, p.name)}
                              aria-label={`Delete ${p.name}`}
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

export default AdminPartners;

