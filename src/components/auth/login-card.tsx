import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Image from 'next/image';

const LoginCard = () => {
  return (
    <Card className="w-[380px] rounded-xl border border-primary bg-white text-foreground shadow-3xl">
      <CardHeader className="p-0">
        <div className="mb-6 w-full rounded-t-lg bg-[#153733] p-8">
          <Image
            src="/logo_iluma_small.svg"
            alt="Iluma logo"
            width={280}
            height={90}
            className="mx-auto rounded-t-lg object-contain"
          />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center gap-4 p-6">
        <div>
          <p className="text-center text-lg font-bold text-primary">
            Bienvenido a Iluma
          </p>
          <p className="text-center text-sm font-normal text-primary">
            Inicia sesión para hacer un pedido
          </p>
        </div>
        <Button className="mb-2 rounded-full bg-primary hover:bg-primary/90">
          <a href="/auth/login">Entrar</a>
        </Button>
      </CardContent>
    </Card>
  );
};

export default LoginCard;
