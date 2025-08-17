import { Modal, Text, Space } from "@mantine/core";
import GoogleSigninButton from "../ui/GoogleSigninButton";
import AppleSigninButton from "../ui/AppleSigninButton";

interface AuthModalProps {
  opened: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

export default function AuthModal({ 
  opened, 
  onClose, 
  title = "Authentication Required",
  message = "Please sign in to continue"
}: AuthModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={<strong>{title}</strong>}
      size="lg"
      centered
    >
      <Text size="md" c="dimmed" ta="center" mb="xl">
        {message}
      </Text>
      
      <div className="px-20">
        <GoogleSigninButton />
        <Space h="md" />
        <AppleSigninButton />
      </div>
    </Modal>
  );
}
