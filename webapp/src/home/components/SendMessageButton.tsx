import { AccountWithUser, Pokemon } from "../../utils/types";
import Button from "@mui/material/Button";
import { sendTradeMessage } from "../../utils/apis";
import { useState } from "react";
import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar";
import { AxiosError } from "axios";

const enum SentState {
  NotSent = 1,
  Loading = 2,
  Sent = 3
}

type SendMessageButtonProps = {
  account: AccountWithUser;
  pokemon: Pokemon;
}
export default function SendMessageButton(props: SendMessageButtonProps) {
  const { account, pokemon } = props;
  const [sentState, setSentState] = useState(SentState.NotSent);
  const [sentError, setSentError] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const caption = sentState === SentState.NotSent ? 'Send Message' : !sentError ? 'Sent' : 'Failed';
  const sendMessage = async () => {
    setSentState(SentState.Loading);
    try {
        const { data: message } = await sendTradeMessage(pokemon.id, account.user);
        setToastMessage(message);
    }
    catch (error) {
      let message: string | undefined = undefined;
      if (error instanceof AxiosError) {
        message = error.response?.data?.message;
      }
      setToastMessage(!!message ? message : 'Bot failed to send message.');
      setSentError(true);
    }
    finally {
      setSentState(SentState.Sent);
      setToastOpen(true);
    }
  }  
  const handleToastClose = (event?: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === 'clickaway') return;
    setToastOpen(false);
    event?.preventDefault();
  };

  return <>
    <Button
      size='small'
      variant='outlined'
      onClick={sendMessage}
      loading={sentState === SentState.Loading}
      disabled={sentState === SentState.Sent}
    >
      {caption}
    </Button>
    <Snackbar
      open={toastOpen}
      autoHideDuration={3000}
      onClose={handleToastClose}
      message={toastMessage}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center'
      }}
    />
  </>
}
