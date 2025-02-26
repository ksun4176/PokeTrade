import Box from "@mui/material/Box";
import Card from "@mui/material/Card"
import Typography from "@mui/material/Typography";
import { AccountWithUser, Pokemon } from "../../utils/types";
import Avatar from "@mui/material/Avatar";
import { SxProps } from "@mui/material/styles";
import SendMessageButton from "./SendMessageButton";

type AccountCardProps = {
  /**
   * Account information
   */
  account: AccountWithUser;
  /**
   * Pokemon information if we want to send an offer for one to the owner of linked account
   */
  pokemon?: Pokemon;
  /**
   * CSS styling for containing card
   */
  cardSx?: SxProps;
}
/**
 * The card holding account information
 */
export default function AccountCard(props: AccountCardProps) {
  const { account, pokemon, cardSx } = props;
  return <Card variant="outlined" sx={{
    display: 'flex',
    pt: 4,
    ...cardSx
  }}>
    <Avatar sx={{ mx: 1 }}>{account.user.username[0]}</Avatar>
    <Box display='flex' flexDirection='column' gap={1}>
      <Typography>{account.user.username}</Typography>
      {pokemon &&
        <SendMessageButton account={account} pokemon={pokemon} />
      }
    </Box>
  </Card>
}