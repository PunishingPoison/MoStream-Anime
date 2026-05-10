'use client';

import { Button, Card, CardBody, CardFooter, CardHeader } from '@heroui/react';
import { useLocalStorage } from '@mantine/hooks';
import { ADS_WARNING_STORAGE_KEY } from '@/utils/constants';

const AdsWarning = () => {
  const [seen, setSeen] = useLocalStorage({
    key: ADS_WARNING_STORAGE_KEY,
    defaultValue: false,
    getInitialValueInEffect: true,
  });

  const handleDismiss = () => setSeen(true);

  if (seen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
      <Card className="mx-4 max-w-md border border-white/10 bg-secondary-background shadow-2xl shadow-black/40">
        <CardHeader>
          <h2 className="text-xl font-bold">Streaming Notice</h2>
        </CardHeader>
        <CardBody>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The embedded players may contain ads or popups. We recommend using an ad blocker for the best
            experience. We are not responsible for the content displayed by third-party players.
          </p>
        </CardBody>
        <CardFooter className="flex gap-2">
          <Button color="primary" fullWidth onPress={handleDismiss} className="font-semibold shadow-lg shadow-primary/30">
            I Understand, Continue
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdsWarning;
