import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
  } from "@/components/ui/card";
import { UsersTable } from "@/components/users/users-table";
  
  const UsersCard = () => {
    return (
      <Card className="w-full max-w-[900px] mx-auto">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Usuarios</CardTitle>
          <CardDescription className="text-md text-muted-foreground">
            Estos son los usuarios de la plataforma.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 sm:p-4">
          <UsersTable />
        </CardContent>
      </Card>
    );
  };
  
export default UsersCard;
  