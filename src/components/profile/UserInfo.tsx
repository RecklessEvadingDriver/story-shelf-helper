import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface User {
  id: string;
  email: string;
  name?: string;
}

interface UserInfoProps {
  user: User;
}

export const UserInfo = ({ user }: UserInfoProps) => {
  return (
    <div className="flex flex-col items-center text-center">
      <Avatar className="h-24 w-24 mb-4">
        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`} />
        <AvatarFallback className="bg-primary text-primary-foreground text-xl">
          {user.name?.charAt(0) || user.email.charAt(0)}
        </AvatarFallback>
      </Avatar>
      <h2 className="text-xl font-semibold text-foreground mb-2">
        {user.name || 'Anonymous User'}
      </h2>
      <p className="text-sm text-muted-foreground mb-3">{user.email}</p>
      <Badge variant="secondary" className="text-xs">Member since 2024</Badge>
    </div>
  );
};