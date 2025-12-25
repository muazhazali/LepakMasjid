import { AdminLayout } from '@/components/Admin/AdminLayout';
import { AuthGuard } from '@/components/Auth/AuthGuard';
import { useMosques } from '@/hooks/use-mosques';
import { useTranslation } from '@/hooks/use-translation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';

const Mosques = () => {
  const { t } = useTranslation();
  const { data: mosques = [], isLoading } = useMosques();

  return (
    <AuthGuard requireAdmin>
      <AdminLayout>
        <div>
          <h1 className="font-display text-3xl font-bold mb-8">{t('admin.mosques')}</h1>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {mosques.map((mosque) => (
                <Card key={mosque.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>
                        <Link to={`/mosque/${mosque.id}`} className="hover:underline">
                          {mosque.name}
                        </Link>
                      </CardTitle>
                      <Badge variant={mosque.status === 'approved' ? 'default' : 'secondary'}>
                        {mosque.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{mosque.address}</p>
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

export default Mosques;

