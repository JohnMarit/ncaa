import { useState } from "react";
import { Plus, Edit, Trash2, Users } from "lucide-react";
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
import type { MentorProfile } from "@/contexts/AdminDataContext";

const emptyForm = {
  name: "",
  position: "",
  organization: "",
  photoUrl: "",
  story: "",
};

const AdminMentors = () => {
  const { toast } = useToast();
  const { mentors, addMentor, updateMentor, deleteMentor } = useAdminData();

  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const err: Record<string, string> = {};
    if (!form.name.trim()) err.name = "Name is required.";
    if (!form.position.trim()) err.position = "Position / title is required.";
    if (!form.story.trim()) err.story = "Please add a brief or full article about this mentor’s journey.";
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
        position: form.position.trim(),
        organization: form.organization.trim() || undefined,
        photoUrl: form.photoUrl.trim() || undefined,
        story: form.story.trim(),
      };
      if (editingId) {
        await updateMentor(editingId, data);
        toast({ title: "Mentor Updated", description: "Changes saved." });
      } else {
        await addMentor(data);
        toast({
          title: "Mentor Added",
          description: "She / he will appear under “Girls Mentors and People They Look Up To”.",
        });
      }
      reset();
      setIsOpen(false);
    } catch {
      toast({
        title: "Error",
        description: "Could not save mentor. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (m: MentorProfile) => {
    setForm({
      name: m.name,
      position: m.position,
      organization: m.organization ?? "",
      photoUrl: m.photoUrl ?? "",
      story: m.story ?? "",
    });
    setErrors({});
    setEditingId(m.id);
    setIsOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Remove mentor profile for "${name}"?`)) return;
    try {
      await deleteMentor(id);
      toast({ title: "Removed", description: "Mentor profile deleted." });
    } catch {
      toast({
        title: "Error",
        description: "Could not delete mentor profile.",
        variant: "destructive",
      });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Girls Mentors &amp; Role Models</h1>
            <p className="text-muted-foreground">
              Add mentors that girls look up to. Write a brief or full article about their journey,
              experience, and the positions they hold now.
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
                Add Mentor
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit Mentor" : "Add Mentor"}</DialogTitle>
                <DialogDescription>
                  This content will appear on the homepage under “Girls Mentors and People They Look Up To”.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2 md:grid-cols-2 md:gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="m-name">Name *</Label>
                      <Input
                        id="m-name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="e.g. Prof. Achol Deng"
                        className={errors.name ? "border-destructive" : ""}
                      />
                      {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="m-position">Position / Title *</Label>
                      <Input
                        id="m-position"
                        value={form.position}
                        onChange={(e) => setForm({ ...form, position: e.target.value })}
                        placeholder="e.g. Lecturer, Engineer, Community Elder"
                        className={errors.position ? "border-destructive" : ""}
                      />
                      {errors.position && <p className="text-sm text-destructive">{errors.position}</p>}
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="m-org">Organisation / Place</Label>
                    <Input
                      id="m-org"
                      value={form.organization}
                      onChange={(e) => setForm({ ...form, organization: e.target.value })}
                      placeholder="e.g. University of Juba, Arialbeek, NCAA"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="m-photo">Photo URL</Label>
                    <Input
                      id="m-photo"
                      value={form.photoUrl}
                      onChange={(e) => setForm({ ...form, photoUrl: e.target.value })}
                      placeholder="https://..."
                      className={errors.photoUrl ? "border-destructive" : ""}
                    />
                    {errors.photoUrl && <p className="text-sm text-destructive">{errors.photoUrl}</p>}
                    <p className="text-xs text-muted-foreground">
                      Square or portrait photos work best. Leave blank to show initials.
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="m-story">Journey / Experience *</Label>
                    <Textarea
                      id="m-story"
                      rows={6}
                      value={form.story}
                      onChange={(e) => setForm({ ...form, story: e.target.value })}
                      placeholder="Write a brief or full article about how this mentor reached where they are, and what they share with girls…"
                      className={errors.story ? "border-destructive" : ""}
                    />
                    {errors.story && <p className="text-sm text-destructive">{errors.story}</p>}
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
                  <Button type="submit">{editingId ? "Save Changes" : "Add Mentor"}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Mentors</CardTitle>
            <CardDescription>
              These mentors appear publicly on the homepage. Use the story field to tell their journey in a way that
              inspires girls.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {mentors.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-12 text-center">
                <Users className="mb-4 h-12 w-12 text-muted-foreground" />
                <p className="font-medium">No mentors added yet.</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Add women and men that girls look up to – teachers, elders, professionals and community leaders.
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
                  Add Mentor
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto -mx-1">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mentor</TableHead>
                      <TableHead className="max-w-[360px]">Journey / Article</TableHead>
                      <TableHead className="w-[100px] text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mentors.map((m) => {
                      const snippet = (m.story ?? "").length > 180 ? `${m.story.slice(0, 180)}…` : m.story;
                      return (
                        <TableRow key={m.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              {m.photoUrl ? (
                                <img
                                  src={m.photoUrl}
                                  alt={m.name}
                                  className="h-10 w-10 rounded-full object-cover"
                                />
                              ) : (
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                                  {m.name
                                    .split(" ")
                                    .map((p) => p[0])
                                    .join("")
                                    .slice(0, 2)
                                    .toUpperCase()}
                                </div>
                              )}
                              <div>
                                <p className="font-medium">{m.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {m.position}
                                  {m.organization ? ` · ${m.organization}` : ""}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="max-w-[360px] truncate text-sm text-muted-foreground">
                            {snippet}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0"
                                onClick={() => handleEdit(m)}
                                aria-label={`Edit ${m.name}`}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 text-[hsl(var(--brand-feminine-600))]"
                                onClick={() => handleDelete(m.id, m.name)}
                                aria-label={`Delete ${m.name}`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
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

export default AdminMentors;

