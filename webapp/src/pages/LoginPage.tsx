import { FaDiscord, FaQuestionCircle } from "react-icons/fa";
import Button from '@mui/material/Button';
import '../styles/LoginPage.scss';

export const LoginPage = () => <div className="div__loginPage div--height-full div--flex-column">
  <div className="div__loginPageButtons">
    <Button variant="outlined" startIcon={<FaDiscord color="5865F2" />} className="button__loginPage">
      Login with Discord
    </Button>
    <Button variant="outlined" startIcon={<FaQuestionCircle />} className="button__loginPage">
      Support Server
    </Button>
  </div>
  <div className="div__footer">
    <span>Privacy Policy</span>
    <span>Terms of Service</span>
    <span>Contact Us</span>
  </div>
</div>