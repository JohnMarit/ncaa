import { useState } from "react";
import { FileText, Plus, Upload, Download, Edit, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const Documents = () => {
    const { toast } = useToast();
    const { documents, addDocument, deleteDocument } = useAdminData();
    const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [uploadForm, setUploadForm] = useState({
        file: null as File | null,
        title: "",
        category: "",
    });
    const [createForm, setCreateForm] = useState({
        title: "",
        category: "",
        version: "",
        size: "",
        type: "PDF",
        status: "draft" as "published" | "draft",
    });

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setUploadForm({ ...uploadForm, file, title: file.name });
        }
    };

    const handleUpload = (e: React.FormEvent) => {
        e.preventDefault();
        if (!uploadForm.file || !uploadForm.title || !uploadForm.category) {
            toast({
                title: "Validation Error",
                description: "Please fill in all required fields and select a file.",
                variant: "destructive",
            });
            return;
        }

        const fileSize = (uploadForm.file.size / (1024 * 1024)).toFixed(2);
        addDocument({
            title: uploadForm.title,
            category: uploadForm.category,
            version: "v1.0",
            size: `${fileSize} MB`,
            type: uploadForm.file.type.includes("pdf") ? "PDF" : "Document",
            status: "published",
        });

        toast({
            title: "Document Uploaded",
            description: "The document has been successfully uploaded.",
        });

        setUploadForm({ file: null, title: "", category: "" });
        setIsUploadDialogOpen(false);
    };

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!createForm.title || !createForm.category) {
            toast({
                title: "Validation Error",
                description: "Please fill in all required fields.",
                variant: "destructive",
            });
            return;
        }

        addDocument({
            title: createForm.title,
            category: createForm.category,
            version: createForm.version || "v1.0",
            size: createForm.size || "0 MB",
            type: createForm.type,
            status: createForm.status,
        });

        toast({
            title: "Document Created",
            description: "The document has been successfully created.",
        });

        setCreateForm({
            title: "",
            category: "",
            version: "",
            size: "",
            type: "PDF",
            status: "draft",
        });
        setIsCreateDialogOpen(false);
    };

    const handleDelete = (id: string) => {
        if (!confirm("Are you sure you want to delete this document?")) return;
        deleteDocument(id);
        toast({
            title: "Document Deleted",
            description: "The document has been deleted.",
        });
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Document Management</h1>
                        <p className="text-muted-foreground">Upload and manage official documents</p>
                    </div>
                    <div className="flex gap-2">
                        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline">
                                    <Upload className="mr-2 h-4 w-4" />
                                    Upload Document
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Upload Document</DialogTitle>
                                    <DialogDescription>Upload a file to add to the document library</DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleUpload}>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="file">File *</Label>
                                            <Input
                                                id="file"
                                                type="file"
                                                accept=".pdf,.doc,.docx"
                                                onChange={handleFileUpload}
                                                required
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="uploadTitle">Title *</Label>
                                            <Input
                                                id="uploadTitle"
                                                placeholder="Document title"
                                                value={uploadForm.title}
                                                onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="uploadCategory">Category *</Label>
                                            <Input
                                                id="uploadCategory"
                                                placeholder="e.g., Constitution, Regulations, Reports"
                                                value={uploadForm.category}
                                                onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button type="button" variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                                            Cancel
                                        </Button>
                                        <Button type="submit">Upload</Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                            <DialogTrigger asChild>
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create Document
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Create Document</DialogTitle>
                                    <DialogDescription>Create a new document entry</DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleCreate}>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="createTitle">Title *</Label>
                                            <Input
                                                id="createTitle"
                                                placeholder="Document title"
                                                value={createForm.title}
                                                onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="createCategory">Category *</Label>
                                            <Input
                                                id="createCategory"
                                                placeholder="e.g., Constitution, Regulations, Reports"
                                                value={createForm.category}
                                                onChange={(e) => setCreateForm({ ...createForm, category: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="version">Version</Label>
                                                <Input
                                                    id="version"
                                                    placeholder="v1.0"
                                                    value={createForm.version}
                                                    onChange={(e) => setCreateForm({ ...createForm, version: e.target.value })}
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="size">Size</Label>
                                                <Input
                                                    id="size"
                                                    placeholder="e.g., 2.5 MB"
                                                    value={createForm.size}
                                                    onChange={(e) => setCreateForm({ ...createForm, size: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="status">Status</Label>
                                            <select
                                                id="status"
                                                title="Document Status"
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                                value={createForm.status}
                                                onChange={(e) => setCreateForm({ ...createForm, status: e.target.value as "published" | "draft" })}
                                            >
                                                <option value="draft">Draft</option>
                                                <option value="published">Published</option>
                                            </select>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                                            Cancel
                                        </Button>
                                        <Button type="submit">Create</Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* Documents Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Documents</CardTitle>
                        <CardDescription>All official documents and files</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Version</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Size</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {documents.map((doc) => (
                                        <TableRow key={doc.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                                    <span className="font-medium">{doc.title}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{doc.category}</Badge>
                                            </TableCell>
                                            <TableCell>{doc.version}</TableCell>
                                            <TableCell>{new Date(doc.date).toLocaleDateString()}</TableCell>
                                            <TableCell>{doc.size}</TableCell>
                                            <TableCell>
                                                {doc.status === "published" && (
                                                    <Badge className="bg-[hsl(var(--brand-primary-100))] text-[hsl(var(--brand-primary-800))]">Published</Badge>
                                                )}
                                                {doc.status === "draft" && (
                                                    <Badge className="bg-[hsl(var(--brand-secondary-100))] text-[hsl(var(--brand-secondary-800))]">Draft</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                                        <Download className="h-4 w-4" />
                                                    </Button>
                                                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-8 w-8 p-0 text-[hsl(var(--brand-feminine-600))]"
                                                        onClick={() => handleDelete(doc.id)}
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
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
};

export default Documents;

