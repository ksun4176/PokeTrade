import { Route, Routes } from "react-router-dom";
import LogIn from "./login/Login";
import Welcome from "./welcome/Welcome";
import { useFetchAccount } from "./utils/hooks/useFetchAccount";
import { AccountContext } from "./utils/contexts/AccountContext";
import { useFetchPokemons } from "./utils/hooks/useFetchPokemons";
import { Account } from "./utils/types";
import { LoadingOverlay } from "./sharedComponents/LoadingOverlay";
 
function App() {
  const { account, setAccount, accountError, accountLoading } = useFetchAccount();
  const { pokemons, pokemonsError, pokemonsLoading } = useFetchPokemons();

  if (accountLoading || pokemonsLoading) {
    return <LoadingOverlay />
  }

  const updateAccount = (account: Account) => setAccount(account);
  return <AccountContext.Provider value={{ account, updateAccount }}>
    { account && !accountError && pokemons && !pokemonsError ?
      <Routes>
        <Route path="/" element={<LogIn />} />
        <Route path="/welcome" element={<Welcome pokemons={pokemons!} />} />
      </Routes> :
      <Routes>
        <Route path="/" element={<LogIn />} />
      </Routes>
    }
  </AccountContext.Provider>
}

export default App;
