import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAdminData } from "@/contexts/AdminDataContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Mail, Trash2, Eye, AlertCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Messages = () => {
  const { contactMessages, markContactMessageRead, deleteContactMessage } = useAdminData();
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);

  const message = selectedMessage
    ? contactMessages.find((m) => m.id === selectedMessage)
    : null;

  const handleMarkRead = async (id: string, read: boolean) => {
    try {
      await markContactMessageRead(id, read);
    } catch (error) {
      console.error("Failed to mark message:", error);
      alert("Failed to update message status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    try {
      await deleteContactMessage(id);
      if (selectedMessage === id) {
        setSelectedMessage(null);
      }
    } catch (error) {
      console.error("Failed to delete message:", error);
      alert("Failed to delete message");
    }
  };

  const unreadCount = contactMessages.filter((m) => !m.read).length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Contact Messages</h1>
            <p className="text-muted-foreground">View and manage messages from the contact form</p>
          </div>
          <Card className="w-fit">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Unread</p>
                <p className="text-2xl font-bold">{unreadCount}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {contactMessages.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Mail className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="mt-4 font-semibold">No messages yet</h3>
              <p className="text-center text-sm text-muted-foreground">
                Messages from the contact form will appear here
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {contactMessages.map((msg) => (
              <Card
                key={msg.id}
                className={`cursor-pointer transition-colors hover:bg-accent ${
                  !msg.read ? "border-primary/50 bg-primary/5" : ""
                }`}
                onClick={() => setSelectedMessage(msg.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-1">
                      <CardTitle className="text-lg">{msg.subject}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <span>{msg.name}</span>
                        <span>•</span>
                        <span>{msg.email}</span>
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {!msg.read && (
                        <div className="flex h-2 w-2 rounded-full bg-primary" title="Unread" />
                      )}
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(msg.submittedAt), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-2 text-sm text-muted-foreground">{msg.message}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Message Detail Dialog */}
        <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
          <DialogContent className="max-w-2xl">
            {message && (
              <>
                <DialogHeader>
                  <DialogTitle>{message.subject}</DialogTitle>
                  <DialogDescription className="flex items-center gap-2">
                    <span>{message.name}</span>
                    <span>•</span>
                    <span>{message.email}</span>
                    <span>•</span>
                    <span>{formatDistanceToNow(new Date(message.submittedAt), { addSuffix: true })}</span>
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="rounded-lg bg-muted p-4">
                    <p className="whitespace-pre-wrap text-sm">{message.message}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={message.read ? "outline" : "default"}
                      onClick={() => handleMarkRead(message.id, !message.read)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Mark as {message.read ? "Unread" : "Read"}
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(message.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default Messages;
