import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Trash2, Shield, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { toast } from '@/hooks/use-toast';

interface MockUser {
  id: string;
  email: string;
  role: 'user' | 'admin';
}

const initialUsers: MockUser[] = [
  { id: 'usr-001-abc', email: 'alice@example.com', role: 'user' },
  { id: 'usr-002-def', email: 'bob@example.com', role: 'admin' },
  { id: 'usr-003-ghi', email: 'carol@example.com', role: 'user' },
];

export default function AdminPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<MockUser[]>(initialUsers);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleCreateUser = () => {
    if (!newEmail || !newPassword) {
      toast({ title: 'Error', description: 'Email and password are required.', variant: 'destructive' });
      return;
    }
    const newUser: MockUser = {
      id: `usr-${String(users.length + 1).padStart(3, '0')}-${Math.random().toString(36).slice(2, 5)}`,
      email: newEmail,
      role: 'user',
    };
    setUsers((prev) => [...prev, newUser]);
    setNewEmail('');
    setNewPassword('');
    setDialogOpen(false);
    toast({ title: 'User created', description: `${newEmail} has been added.` });
  };

  const handleDeleteUser = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    toast({ title: 'User deleted' });
  };

  const toggleAdmin = (id: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, role: u.role === 'admin' ? 'user' : 'admin' } : u,
      ),
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="sticky top-0 z-10 border-b border-border bg-surface/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-lg font-semibold">Admin Panel</h1>
          <div className="w-[140px]" />
        </div>
      </nav>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">User Management</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Create, manage roles, and remove users.
              </p>
            </div>

            {/* Create New User Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-1.5 h-4 w-4" />
                  Create New User
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New User</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="new-email">Email</Label>
                    <Input
                      id="new-email"
                      type="email"
                      placeholder="user@example.com"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                  <Button className="w-full" onClick={handleCreateUser}>
                    Create User
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Users Table */}
          <div className="rounded-xl border border-border bg-surface shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead className="w-[120px] text-center">Role</TableHead>
                  <TableHead className="w-[100px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {users.map((user) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="border-b transition-colors data-[state=selected]:bg-muted hover:bg-muted/50"
                    >
                      <TableCell className="font-medium">{user.email}</TableCell>
                      <TableCell className="text-center">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant={user.role === 'admin' ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => toggleAdmin(user.id)}
                              className="gap-1.5"
                            >
                              {user.role === 'admin' ? (
                                <ShieldCheck className="h-3.5 w-3.5" />
                              ) : (
                                <Shield className="h-3.5 w-3.5" />
                              )}
                              {user.role === 'admin' ? 'Admin' : 'User'}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {user.role === 'admin' ? (
                              <span>ID: {user.id} — Click to remove admin</span>
                            ) : (
                              <span>Click to make admin</span>
                            )}
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
                {users.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="py-8 text-center text-muted-foreground">
                      No users yet. Create one to get started.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
