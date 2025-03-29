import { Center } from "@mantine/core";
import AuthCallback from "../../features/auth/ui/AuthCallback";

export default function AuthCallbackPage() {
  return (
    <div>

      <Center maw={"100%"} h={"100vh"} >
        <AuthCallback />
      </Center>

    </div>
  );
}
