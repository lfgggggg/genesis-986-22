import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMessages } from "@/hooks/useMessages";
import { MessageCircle, Mail, CheckCircle, Clock } from "lucide-react";

const Messages = () => {
  const { messages, loading, unreadCount, markAsRead, markAllAsRead } = useMessages();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'credential':
        return <Mail className="w-4 h-4 text-primary" />;
      case 'notification':
        return <MessageCircle className="w-4 h-4 text-success" />;
      default:
        return <MessageCircle className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-4">
              Your <span className="bg-gradient-primary bg-clip-text text-transparent">Messages</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Account credentials, notifications, and important updates
            </p>
          </div>
          {unreadCount > 0 && (
            <Button onClick={markAllAsRead} variant="outline">
              Mark All Read ({unreadCount})
            </Button>
          )}
        </div>

        {/* Messages List */}
        <div className="space-y-4">
          {messages.length === 0 ? (
            <Card className="p-8 glass-card text-center">
              <MessageCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Messages Yet</h3>
              <p className="text-muted-foreground">
                Purchase an account to receive credentials and notifications here.
              </p>
            </Card>
          ) : (
            messages.map((message) => (
              <Card
                key={message.id}
                className={`p-6 glass-card cursor-pointer transition-all hover:border-primary/30 ${
                  !message.read ? 'border-primary/20 bg-primary/5' : ''
                }`}
                onClick={() => !message.read && markAsRead(message.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {getTypeIcon(message.type)}
                    <div>
                      <h3 className="font-semibold flex items-center space-x-2">
                        <span>{message.title}</span>
                        {!message.read && (
                          <Badge variant="secondary" className="ml-2">New</Badge>
                        )}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(message.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {message.read ? (
                      <CheckCircle className="w-4 h-4 text-success" />
                    ) : (
                      <Clock className="w-4 h-4 text-warning" />
                    )}
                  </div>
                </div>
                <div className="pl-7">
                  <pre className="whitespace-pre-wrap text-sm text-muted-foreground font-mono bg-surface/50 p-4 rounded-lg">
                    {message.content}
                  </pre>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;