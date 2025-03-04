import { AccountEditContent, EditAccountState } from "./components/AccountEditContent";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AccountContext } from "../utils/contexts/AccountContext";
import { SaveAccountToDb } from "../utils/apis";
import EditContainer from "./components/EditContainer";

export default function AccountEdit() {
  const { account, setAccount } = useContext(AccountContext);
  const navigate = useNavigate();

  const [accountDetails, setAccountDetails] = useState<EditAccountState>({
    inGameName: '',
    friendCode: '',
    inGameNameValid: false,
    friendCodeValid: false
  });
  const accountValid: Record<string, boolean> = {
    inGameNameValid: accountDetails.inGameNameValid,
    friendCodeValid: accountDetails.friendCodeValid
  }
  const saveAccount = async () => {
    const newAccount = await SaveAccountToDb(account, accountDetails);
    setAccount(newAccount);
    navigate(-1);
  }

  const [resetNum, setResetNum] = useState(0);
  const resetFields = () => setResetNum(oldNum => oldNum+1);
  
  return <EditContainer
    onResetButtonClicked={resetFields}
    onSaveButtonClicked={saveAccount}
    saveButtonDisabled={!Object.values(accountValid).every(isValid => isValid)}
  >
    <AccountEditContent
      setAccountDetails={setAccountDetails}
      resetNum={resetNum}
    />
  </EditContainer>
}