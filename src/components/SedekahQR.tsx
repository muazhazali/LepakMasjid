import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink } from "lucide-react";
import { sedekahApi } from "@/lib/sedekahQR";

interface SedekahQRProps {
  masjidName: string;
}

const SedekahQR: React.FC<SedekahQRProps> = ({ masjidName }) => {
  const [qrSvg, setQrSvg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchQR() {
      if (!masjidName) return;

      setIsLoading(true);
      setError(false);

      try {
        const res = await sedekahApi.getQR(masjidName);
        setQrSvg(res.svg);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    }

    fetchQR();
  }, [masjidName]);

  return (
    <Card className="w-full max-w-sm mx-auto shadow-lg">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-lg font-medium">Sedekah QR</CardTitle>
        <p className="text-sm text-muted-foreground">{masjidName}</p>
      </CardHeader>

      <CardContent className="flex justify-center p-6 pt-0">
        <div className="w-64 h-64 bg-white rounded-xl p-4 border flex items-center justify-center">
          {isLoading ? (
            <Skeleton className="w-full h-full rounded-lg" />
          ) : error ? (
            <div className="flex flex-col items-center text-center gap-2 text-muted-foreground">
              <ExternalLink className="w-8 h-8 opacity-50" />
              <p className="text-sm font-medium">QR Not Found</p>
              <p className="text-xs">Try searching directly on Sedekah.je</p>
            </div>
          ) : (
            qrSvg && (
              <div
                className="w-full h-full [&>svg]:w-full [&>svg]:h-full"
                dangerouslySetInnerHTML={{ __html: qrSvg }}
              />
            )
          )}
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-2 pt-0 pb-6 text-center">
        <div className="text-xs text-muted-foreground">
          Powered by
          <a
            href="https://sedekah.je"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-primary ml-1 hover:underline"
          >
            Sedekah.je
          </a>
        </div>

        <Button asChild size="sm" variant="outline" className="w-full mt-2">
          <a
            href="https://sedekah.je"
            target="_blank"
            rel="noopener noreferrer"
            className="gap-2"
          >
            Visit Sedekah.je <ExternalLink className="w-3 h-3" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SedekahQR;
