import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User } from "@supabase/supabase-js";

interface UserInfoProps {
  user: User;
}

export const UserInfo = ({ user }: UserInfoProps) => {
  return (
    <div className="flex flex-col items-center text-center">
      <Avatar className="h-24 w-24 mb-4">
        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`} />
        <AvatarFallback className="bg-primary text-primary-foreground text-xl">
          {user.email?.charAt(0) || 'A'}
        </AvatarFallback>
      </Avatar>
      <h2 className="text-xl font-semibold text-foreground mb-2">
        {user.user_metadata?.full_name || 'Anonymous User'}
      </h2>
      <p className="text-sm text-muted-foreground mb-3">{user.email || 'No email provided'}</p>
      <Badge variant="secondary" className="text-xs">Member since {new Date(user.created_at).getFullYear()}</Badge>
    </div>
  );
};