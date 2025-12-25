import { AdminLayout } from '@/components/Admin/AdminLayout';
import { AuthGuard } from '@/components/Auth/AuthGuard';
import { useUsers, useBanUser, useUnbanUser } from '@/hooks/use-users';
import { useTranslation } from '@/hooks/use-translation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

const Users = () => {
  const { t } = useTranslation();
  const { data: users = [], isLoading } = useUsers();
  const banUser = useBanUser();
  const unbanUser = useUnbanUser();

  const handleBan = async (id: string) => {
    try {
      await banUser.mutateAsync(id);
      toast.success('User banned');
    } catch (error) {
      toast.error('Failed to ban user');
    }
  };

  const handleUnban = async (id: string) => {
    try {
      await unbanUser.mutateAsync(id);
      toast.success('User unbanned');
    } catch (error) {
      toast.error('Failed to unban user');
    }
  };

  return (
    <AuthGuard requireAdmin>
      <AdminLayout>
        <div>
          <h1 className="font-display text-3xl font-bold mb-8">{t('admin.users')}</h1>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {users.map((user) => (
                <Card key={user.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{user.name || user.email}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant={user.verified ? 'default' : 'destructive'}>
                          {user.verified ? 'Active' : 'Banned'}
                        </Badge>
                        <Badge variant="secondary">Trust: {user.trust_score}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-2">{user.email}</p>
                    <div className="flex gap-2">
                      {user.verified ? (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleBan(user.id)}
                          disabled={banUser.isPending}
                        >
                          Ban
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleUnban(user.id)}
                          disabled={unbanUser.isPending}
                        >
                          Unban
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </AdminLayout>
    </AuthGuard>
  );
};

export default Users;

