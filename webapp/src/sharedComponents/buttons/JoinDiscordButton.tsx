import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { FaDiscord } from "react-icons/fa";

/**
 * Button to join discord
 */
interface IJoinDiscordButtonProps {
  isIconButton?: boolean
}
export function JoinDiscordButton(props: IJoinDiscordButtonProps) {
  const { isIconButton } = props;
  const target = '_blank';
  const href = 'https://discord.gg/eTJR8VfXPw';

  if (isIconButton) {
    return <IconButton
      target={target}
      href={href}
      aria-label="Join Discord Server"
    >
      <FaDiscord color="5865F2" />
    </IconButton>
  }
  return <Button
    variant="outlined"
    startIcon={<FaDiscord color="5865F2" />}
    target={target}
    href={href}
  >
    Join Discord Server
  </Button>
}