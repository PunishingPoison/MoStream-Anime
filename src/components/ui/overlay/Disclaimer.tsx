'use client';

import { DISCLAIMER_STORAGE_KEY } from '@/utils/constants';
import { Button, Card, CardBody, CardFooter, CardHeader } from '@heroui/react';
import { useLocalStorage } from '@mantine/hooks';

const Disclaimer = () => {
  const [agreed, setAgreed] = useLocalStorage({
    key: DISCLAIMER_STORAGE_KEY,
    defaultValue: false,
    getInitialValueInEffect: true,
  });

  if (agreed) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
      <Card className="mx-4 max-w-md border border-white/10 bg-secondary-background shadow-2xl shadow-black/40">
        <CardHeader className="flex-col items-start gap-4 pb-0">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/20">
              <svg viewBox="0 0 24 24" className="size-5 text-primary" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="12" x2="12" y2="16" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
            </div>
            <h2 className="text-xl font-bold">Before You Start</h2>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Mostream is a free, open-source streaming platform that uses third-party APIs to provide content.
            We do not host any copyrighted material on our servers. All content is sourced from publicly
            available APIs and embedded players.
          </p>
        </CardHeader>
        <CardBody>
          <p className="text-sm leading-relaxed text-muted-foreground">
            By using this site, you agree to our terms. Please ensure you comply with local laws regarding
            streaming content in your region. If you are a copyright holder and believe your content has been
            improperly shared, please contact the relevant API provider.
          </p>
        </CardBody>
        <CardFooter>
          <Button color="primary" fullWidth onPress={() => setAgreed(true)} className="font-semibold shadow-lg shadow-primary/30">
            I Understand
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Disclaimer;
