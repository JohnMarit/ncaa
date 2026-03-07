import { useState, useMemo, useRef } from "react";
import { Calendar, Plus, Trash2, Search, Edit, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useToast } from "@/hooks/use-toast";
import { useAdminData } from "@/contexts/AdminDataContext";
import type { AdminEvent } from "@/contexts/AdminDataContext";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

/** Start of today (local) for categorization. */
function startOfToday(): Date {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
}

/** Derive upcoming vs past from date only (dynamic, no manual toggle). */
function isUpcoming(event: AdminEvent): boolean {
    if (event.type === "upcoming") return true;
    if (event.type === "past") return false;
    const eventDate = new Date(event.date);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate >= startOfToday();
}

const Events = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const { toast } = useToast();
    const { events, addEvent, updateEvent, deleteEvent } = useAdminData();
    const [eventForm, setEventForm] = useState({
        title: "",
        description: "",
        date: "",
        time: "",
        location: "",
        image: "",
        type: "upcoming" as "upcoming" | "past",
        published: true,
    });
    const [editingEventId, setEditingEventId] = useState<string | null>(null);
    const [editFormErrors, setEditFormErrors] = useState<Record<string, string>>({});
    const createImageInputRef = useRef<HTMLInputElement>(null);
    const editImageInputRef = useRef<HTMLInputElement>(null);

    const readFileAsDataUrl = (file: File): Promise<string> =>
        new Promise((resolve, reject) => {
            if (!file.type.startsWith("image/")) {
                reject(new Error("Please select an image file (e.g. JPG, PNG)."));
                return;
            }
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => reject(new Error("Failed to read file."));
            reader.readAsDataURL(file);
        });

    const handleImageFile = async (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            const dataUrl = await readFileAsDataUrl(file);
            setEventForm((prev) => ({ ...prev, image: dataUrl }));
            toast({ title: "Image added", description: "The image will be saved with the event." });
        } catch (err) {
            toast({
                title: "Invalid file",
                description: err instanceof Error ? err.message : "Please select an image file.",
                variant: "destructive",
            });
        }
        e.target.value = "";
    };

    const clearImage = (inputRef: React.RefObject<HTMLInputElement | null>) => {
        setEventForm((prev) => ({ ...prev, image: "" }));
        if (inputRef.current) inputRef.current.value = "";
    };

    const filteredEvents = useMemo(
        () => events.filter((e) => e.title.toLowerCase().includes(searchQuery.toLowerCase())),
        [events, searchQuery]
    );

    /** Upcoming first (nearest date), then past (most recent first). */
    const sortedEvents = useMemo(() => {
        const today = startOfToday();
        return [...filteredEvents].sort((a, b) => {
            const aDate = new Date(a.date);
            aDate.setHours(0, 0, 0, 0);
            const bDate = new Date(b.date);
            bDate.setHours(0, 0, 0, 0);
            const aUpcoming = a.type ? a.type === "upcoming" : aDate >= today;
            const bUpcoming = b.type ? b.type === "upcoming" : bDate >= today;
            if (aUpcoming && !bUpcoming) return -1;
            if (!aUpcoming && bUpcoming) return 1;
            if (aUpcoming && bUpcoming) return aDate.getTime() - bDate.getTime();
            return bDate.getTime() - aDate.getTime();
        });
    }, [filteredEvents]);

    const handleCreateEvent = (e: React.FormEvent) => {
        e.preventDefault();
        const err: Record<string, string> = {};
        if (!eventForm.title.trim()) err.title = "Event title is required.";
        if (!eventForm.description.trim()) err.description = "Event description is required.";
        if (!eventForm.date) err.date = "Event date is required.";
        if (!eventForm.time.trim()) err.time = "Event time is required.";
        if (!eventForm.location.trim()) err.location = "Event location is required.";
        setFormErrors(err);
        if (Object.keys(err).length > 0) {
            toast({
                title: "Validation Error",
                description: "Please fill in all required fields.",
                variant: "destructive",
            });
            return;
        }
        addEvent({
            title: eventForm.title.trim(),
            description: eventForm.description.trim(),
            date: eventForm.date,
            time: eventForm.time.trim(),
            location: eventForm.location.trim(),
            image: eventForm.image.trim() || undefined,
            type: eventForm.type,
            attendees: 0,
            status: eventForm.type === "past" ? "completed" : "active",
            published: eventForm.published,
        });
        toast({
            title: "Event Created",
            description: eventForm.published
                ? "The event is live on the website."
                : "The event is saved as a draft.",
        });
        setEventForm({
            title: "",
            description: "",
            date: "",
            time: "",
            location: "",
            image: "",
            type: "upcoming",
            published: true,
        });
        setFormErrors({});
        if (createImageInputRef.current) createImageInputRef.current.value = "";
        setIsCreateDialogOpen(false);
    };

    /** Format date string for input[type=date] (YYYY-MM-DD). */
    const toDateInputValue = (dateStr: string): string => {
        const d = new Date(dateStr);
        if (Number.isNaN(d.getTime())) return "";
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${y}-${m}-${day}`;
    };

    const handleEditClick = (event: AdminEvent) => {
        setEventForm({
            title: event.title,
            description: event.description,
            date: toDateInputValue(event.date),
            time: event.time || "",
            location: event.location,
            image: event.image || "",
            type: event.type ?? (isUpcoming(event) ? "upcoming" : "past"),
            published: event.published !== false,
        });
        setEditingEventId(event.id);
        setEditFormErrors({});
    };

    const handleUpdateEvent = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingEventId) return;
        const err: Record<string, string> = {};
        if (!eventForm.title.trim()) err.title = "Event title is required.";
        if (!eventForm.description.trim()) err.description = "Event description is required.";
        if (!eventForm.date) err.date = "Event date is required.";
        if (!eventForm.time.trim()) err.time = "Event time is required.";
        if (!eventForm.location.trim()) err.location = "Event location is required.";
        setEditFormErrors(err);
        if (Object.keys(err).length > 0) {
            toast({
                title: "Validation Error",
                description: "Please fill in all required fields.",
                variant: "destructive",
            });
            return;
        }
        updateEvent(editingEventId, {
            title: eventForm.title.trim(),
            description: eventForm.description.trim(),
            date: eventForm.date,
            time: eventForm.time.trim(),
            location: eventForm.location.trim(),
            image: eventForm.image.trim() || undefined,
            type: eventForm.type,
            status: eventForm.type === "past" ? "completed" : "active",
            published: eventForm.published,
        });
        toast({
            title: "Event Updated",
            description: "Changes are saved and will reflect on the website.",
        });
        setEditingEventId(null);
    };

    const handleDelete = (id: string) => {
        deleteEvent(id);
        toast({
            title: "Event Deleted",
            description: "The event has been deleted.",
        });
    };

    const toggleEventCategory = (event: AdminEvent) => {
        const nextType: "upcoming" | "past" = isUpcoming(event) ? "past" : "upcoming";
        updateEvent(event.id, {
            type: nextType,
            status: nextType === "past" ? "completed" : "active",
        });
        toast({
            title: "Event Updated",
            description: nextType === "past" ? "Event moved to Past events." : "Event moved to Upcoming events.",
        });
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Event Management</h1>
                        <p className="text-muted-foreground">Create and manage NCAA events</p>
                    </div>
                    <Dialog open={isCreateDialogOpen} onOpenChange={(open) => { setIsCreateDialogOpen(open); if (!open) setFormErrors({}); }}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Create Event
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-6">
                            <DialogHeader className="flex-shrink-0">
                                <DialogTitle>Create New Event</DialogTitle>
                                <DialogDescription>Fill in the details. Published events appear on the public site; draft events are admin-only.</DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleCreateEvent} className="flex flex-col min-h-0 flex-1 flex">
                                <div className="grid gap-4 py-4 overflow-y-auto min-h-0 flex-1 pr-1">
                                    <div className="grid gap-2">
                                        <Label htmlFor="title">Event Title *</Label>
                                        <Input
                                            id="title"
                                            placeholder="Enter event title"
                                            value={eventForm.title}
                                            onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                                            className={formErrors.title ? "border-destructive" : ""}
                                        />
                                        {formErrors.title && (
                                            <p className="text-sm text-destructive">{formErrors.title}</p>
                                        )}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="description">Event Description *</Label>
                                        <Textarea
                                            id="description"
                                            placeholder="Enter event description"
                                            rows={4}
                                            value={eventForm.description}
                                            onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                                            className={formErrors.description ? "border-destructive" : ""}
                                        />
                                        {formErrors.description && (
                                            <p className="text-sm text-destructive">{formErrors.description}</p>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="date">Event Date *</Label>
                                            <Input
                                                id="date"
                                                type="date"
                                                value={eventForm.date}
                                                onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                                                className={formErrors.date ? "border-destructive" : ""}
                                            />
                                            {formErrors.date && (
                                                <p className="text-sm text-destructive">{formErrors.date}</p>
                                            )}
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="time">Event Time *</Label>
                                            <Input
                                                id="time"
                                                placeholder="e.g., 6:00 PM - 8:00 PM"
                                                value={eventForm.time}
                                                onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                                                className={formErrors.time ? "border-destructive" : ""}
                                            />
                                            {formErrors.time && (
                                                <p className="text-sm text-destructive">{formErrors.time}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Category *</Label>
                                        <Select
                                            value={eventForm.type}
                                            onValueChange={(value) => setEventForm({ ...eventForm, type: value as "upcoming" | "past" })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="upcoming">Upcoming</SelectItem>
                                                <SelectItem value="past">Past</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="location">Event Location *</Label>
                                        <Input
                                            id="location"
                                            placeholder="Enter event location"
                                            value={eventForm.location}
                                            onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                                            className={formErrors.location ? "border-destructive" : ""}
                                        />
                                        {formErrors.location && (
                                            <p className="text-sm text-destructive">{formErrors.location}</p>
                                        )}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Event Image (optional)</Label>
                                        <input
                                            ref={createImageInputRef}
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            id="create-event-image"
                                            onChange={(e) => handleImageFile(e, false)}
                                        />
                                        {eventForm.image ? (
                                            <div className="relative inline-block">
                                                <img
                                                    src={eventForm.image}
                                                    alt="Event preview"
                                                    className="h-32 w-auto rounded-lg border border-border object-cover"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="secondary"
                                                    size="icon"
                                                    className="absolute right-1 top-1 h-7 w-7"
                                                    onClick={() => clearImage(createImageInputRef)}
                                                    aria-label="Remove image"
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ) : null}
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="w-fit"
                                            onClick={() => createImageInputRef.current?.click()}
                                        >
                                            <Upload className="mr-2 h-4 w-4" />
                                            {eventForm.image ? "Change image" : "Upload image"}
                                        </Button>
                                    </div>
                                    <div className="flex items-center justify-between rounded-lg border border-border p-4">
                                        <div>
                                            <Label htmlFor="published">Publish</Label>
                                            <p className="text-sm text-muted-foreground">Show this event on the public website</p>
                                        </div>
                                        <Switch
                                            id="published"
                                            checked={eventForm.published}
                                            onCheckedChange={(checked) => setEventForm({ ...eventForm, published: checked })}
                                        />
                                    </div>
                                </div>
                                <DialogFooter className="flex-shrink-0 border-t border-border pt-4 mt-2">
                                    <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit">Create Event</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>

                    {/* Edit Event Dialog */}
                    <Dialog open={editingEventId !== null} onOpenChange={(open) => { if (!open) setEditingEventId(null); setEditFormErrors({}); }}>
                        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-6">
                            <DialogHeader className="flex-shrink-0">
                                <DialogTitle>Edit Event</DialogTitle>
                                <DialogDescription>Update the event details. Changes will appear on the public site for published events.</DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleUpdateEvent} className="flex flex-col min-h-0 flex-1 flex">
                                <div className="grid gap-4 py-4 overflow-y-auto min-h-0 flex-1 pr-1">
                                    <div className="grid gap-2">
                                        <Label htmlFor="edit-title">Event Title *</Label>
                                        <Input
                                            id="edit-title"
                                            placeholder="Enter event title"
                                            value={eventForm.title}
                                            onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                                            className={editFormErrors.title ? "border-destructive" : ""}
                                        />
                                        {editFormErrors.title && (
                                            <p className="text-sm text-destructive">{editFormErrors.title}</p>
                                        )}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="edit-description">Event Description *</Label>
                                        <Textarea
                                            id="edit-description"
                                            placeholder="Enter event description"
                                            rows={4}
                                            value={eventForm.description}
                                            onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                                            className={editFormErrors.description ? "border-destructive" : ""}
                                        />
                                        {editFormErrors.description && (
                                            <p className="text-sm text-destructive">{editFormErrors.description}</p>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="edit-date">Event Date *</Label>
                                            <Input
                                                id="edit-date"
                                                type="date"
                                                value={eventForm.date}
                                                onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                                                className={editFormErrors.date ? "border-destructive" : ""}
                                            />
                                            {editFormErrors.date && (
                                                <p className="text-sm text-destructive">{editFormErrors.date}</p>
                                            )}
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="edit-time">Event Time *</Label>
                                            <Input
                                                id="edit-time"
                                                placeholder="e.g., 6:00 PM - 8:00 PM"
                                                value={eventForm.time}
                                                onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                                                className={editFormErrors.time ? "border-destructive" : ""}
                                            />
                                            {editFormErrors.time && (
                                                <p className="text-sm text-destructive">{editFormErrors.time}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Category *</Label>
                                        <Select
                                            value={eventForm.type}
                                            onValueChange={(value) => setEventForm({ ...eventForm, type: value as "upcoming" | "past" })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="upcoming">Upcoming</SelectItem>
                                                <SelectItem value="past">Past</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="edit-location">Event Location *</Label>
                                        <Input
                                            id="edit-location"
                                            placeholder="Enter event location"
                                            value={eventForm.location}
                                            onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                                            className={editFormErrors.location ? "border-destructive" : ""}
                                        />
                                        {editFormErrors.location && (
                                            <p className="text-sm text-destructive">{editFormErrors.location}</p>
                                        )}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Event Image (optional)</Label>
                                        <input
                                            ref={editImageInputRef}
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            id="edit-event-image"
                                            onChange={(e) => handleImageFile(e, true)}
                                        />
                                        {eventForm.image ? (
                                            <div className="relative inline-block">
                                                <img
                                                    src={eventForm.image}
                                                    alt="Event preview"
                                                    className="h-32 w-auto rounded-lg border border-border object-cover"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="secondary"
                                                    size="icon"
                                                    className="absolute right-1 top-1 h-7 w-7"
                                                    onClick={() => clearImage(editImageInputRef)}
                                                    aria-label="Remove image"
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ) : null}
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="w-fit"
                                            onClick={() => editImageInputRef.current?.click()}
                                        >
                                            <Upload className="mr-2 h-4 w-4" />
                                            {eventForm.image ? "Change image" : "Upload image"}
                                        </Button>
                                    </div>
                                    <div className="flex items-center justify-between rounded-lg border border-border p-4">
                                        <div>
                                            <Label htmlFor="edit-published">Publish</Label>
                                            <p className="text-sm text-muted-foreground">Show this event on the public website</p>
                                        </div>
                                        <Switch
                                            id="edit-published"
                                            checked={eventForm.published}
                                            onCheckedChange={(checked) => setEventForm({ ...eventForm, published: checked })}
                                        />
                                    </div>
                                </div>
                                <DialogFooter className="flex-shrink-0 border-t border-border pt-4 mt-2">
                                    <Button type="button" variant="outline" onClick={() => setEditingEventId(null)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit">Save Changes</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <Card>
                    <CardContent className="pt-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search events..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Events</CardTitle>
                        <CardDescription>Use Category to control whether an event appears as Upcoming or Past.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Date & Time</TableHead>
                                        <TableHead>Location</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Visibility</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {sortedEvents.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                                                No events yet. Create one to see it here and on the public site.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        sortedEvents.map((event) => (
                                            <TableRow key={event.id}>
                                                <TableCell>
                                                    <div>
                                                        <div className="font-medium">{event.title}</div>
                                                        <div className="text-sm text-muted-foreground line-clamp-1">
                                                            {event.description}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-sm">
                                                        <div>{event.date}</div>
                                                        <div className="text-muted-foreground">{event.time}</div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{event.location}</TableCell>
                                                <TableCell>
                                                    {isUpcoming(event) ? (
                                                        <Badge className="bg-[hsl(var(--brand-primary-100))] text-[hsl(var(--brand-primary-800))]">Upcoming</Badge>
                                                    ) : (
                                                        <Badge variant="outline">Past</Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {event.published !== false ? (
                                                        <Badge className="bg-[hsl(var(--brand-secondary-100))] text-[hsl(var(--brand-secondary-800))]">Published</Badge>
                                                    ) : (
                                                        <Badge variant="outline">Draft</Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="h-8 px-2"
                                                            onClick={() => toggleEventCategory(event)}
                                                        >
                                                            {isUpcoming(event) ? "Mark Past" : "Mark Upcoming"}
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="h-8 w-8 p-0"
                                                            onClick={() => handleEditClick(event)}
                                                            aria-label={`Edit ${event.title}`}
                                                        >
                                                            <Edit className="h-4 w-4 text-[hsl(var(--brand-primary-600))]" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="h-8 w-8 p-0 text-[hsl(var(--brand-feminine-600))]"
                                                            onClick={() => handleDelete(event.id)}
                                                            aria-label={`Delete ${event.title}`}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
};

export default Events;
