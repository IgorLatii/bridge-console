import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Trash2, Shield, ShieldCheck, FileJson, BookOpen } from 'lucide-react';
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
import { userService, type UserDto } from '@/services/userService';

const API_BASE_URL = import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:8081';

export default function AdminPage() {
  const navigate = useNavigate();

  const [users, setUsers] = useState<UserDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [docsLoading, setDocsLoading] = useState(false);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getUsers();
      setUsers(data);
    } catch (error) {
      const message =
          error instanceof Error ? error.message : 'Failed to load users';

      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreateUser = async () => {
    if (!newEmail.trim() || !newPassword.trim()) {
      toast({
        title: 'Error',
        description: 'Email and password are required.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setSubmitting(true);

      const createdUser = await userService.createUser({
        email: newEmail.trim(),
        password: newPassword,
      });

      setUsers((prev) => [...prev, createdUser]);
      setNewEmail('');
      setNewPassword('');
      setDialogOpen(false);

      toast({
        title: 'User created',
        description: `${createdUser.email} has been added.`,
      });
    } catch (error) {
      const message =
          error instanceof Error ? error.message : 'Failed to create user';

      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await userService.deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));

      toast({
        title: 'User deleted',
      });
    } catch (error) {
      const message =
          error instanceof Error ? error.message : 'Failed to delete user';

      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    }
  };

  const toggleAdmin = async (id: string) => {
    try {
      const updatedUser = await userService.toggleUserRole(id);

      setUsers((prev) =>
          prev.map((u) => (u.id === id ? updatedUser : u)),
      );

      toast({
        title: 'Role updated',
        description: `${updatedUser.email} is now ${updatedUser.role}.`,
      });
    } catch (error) {
      const message =
          error instanceof Error ? error.message : 'Failed to update role';

      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    }
  };

  const openSwaggerUi = () => {
    window.open(`${API_BASE_URL}/swagger-ui/index.html`, '_blank');
  };

  const openApiDocs = async () => {
    try {
      setDocsLoading(true);

      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('Token not found. Please log in again.');
      }

      const response = await fetch(`${API_BASE_URL}/v3/api-docs`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to load API docs');
      }

      const data = await response.json();

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      });

      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');

      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch (error) {
      const message =
          error instanceof Error ? error.message : 'Failed to open API docs';

      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setDocsLoading(false);
    }
  };

  return (
      <div className="min-h-screen bg-background text-foreground">
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
          <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
          >
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">User Management</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Create, manage roles, remove users, and access API documentation.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={openSwaggerUi}>
                  <BookOpen className="mr-1.5 h-4 w-4" />
                  Swagger UI
                </Button>

                <Button variant="outline" onClick={openApiDocs} disabled={docsLoading}>
                  <FileJson className="mr-1.5 h-4 w-4" />
                  {docsLoading ? 'Opening...' : 'API Docs'}
                </Button>

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
                            disabled={submitting}
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
                            disabled={submitting}
                        />
                      </div>

                      <Button className="w-full" onClick={handleCreateUser} disabled={submitting}>
                        {submitting ? 'Creating...' : 'Create User'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

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
                  {loading ? (
                      <TableRow>
                        <TableCell colSpan={3} className="py-8 text-center text-muted-foreground">
                          Loading users...
                        </TableCell>
                      </TableRow>
                  ) : users.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="py-8 text-center text-muted-foreground">
                          No users yet. Create one to get started.
                        </TableCell>
                      </TableRow>
                  ) : (
                      <AnimatePresence>
                        {users.map((user) => (
                            <motion.tr
                                key={user.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                className="border-b transition-colors hover:bg-muted/50"
                            >
                              <TableCell className="font-medium">{user.email}</TableCell>

                              <TableCell className="text-center">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                        variant={user.role === 'ADMIN' ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => toggleAdmin(user.id)}
                                        className="gap-1.5"
                                    >
                                      {user.role === 'ADMIN' ? (
                                          <ShieldCheck className="h-3.5 w-3.5" />
                                      ) : (
                                          <Shield className="h-3.5 w-3.5" />
                                      )}
                                      {user.role === 'ADMIN' ? 'Admin' : 'User'}
                                    </Button>
                                  </TooltipTrigger>

                                  <TooltipContent>
                                    {user.role === 'ADMIN' ? (
                                        <span>Click to remove admin</span>
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
                  )}
                </TableBody>
              </Table>
            </div>
          </motion.div>
        </main>
      </div>
  );
}