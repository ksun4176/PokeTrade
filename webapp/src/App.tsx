import { Route, Routes } from "react-router-dom";
import LogIn from "./login/Login";
import Welcome from "./welcome/Welcome";
import { useFetchAccount } from "./utils/hooks/useFetchAccount";
import { AccountContext } from "./utils/contexts/AccountContext";
import { useFetchPokemons } from "./utils/hooks/useFetchPokemons";
import { Account } from "./utils/types";
import { LoadingOverlay } from "./sharedComponents/LoadingOverlay";
import Home from "./home/Home";
import Downtime from "./downtime/Downtime";
 
function App() {
  const { pokemons, pokemonsError, pokemonsLoading } = useFetchPokemons();
  const { user, account, setAccount, accountError, accountLoading } = useFetchAccount();

  if (accountLoading || pokemonsLoading) {
    return <LoadingOverlay />
  }

  const updateAccount = (account: Account) => setAccount(account);

  let routes = <Routes></Routes>
  if (accountError || pokemonsError || !pokemons || pokemons.size === 0) {
    // We hit any error OR can't load pokemons
    routes = <Routes>
      <Route path="/" element={<Downtime />} />
    </Routes>
  }
  else if (!user) {
    // not logged in
    routes = <Routes>
      <Route path="/" element={<LogIn />} />
    </Routes>
  }
  else if (!account) {
    // no account set up
    routes = <Routes>
      <Route path="/" element={<LogIn />} />
      <Route path="/welcome" element={<Welcome pokemons={pokemons} />} />
    </Routes> 
  }
  else {
    // all accessible
    routes = <Routes>
      <Route path="/" element={<LogIn />} />
      <Route path="/welcome" element={<Welcome pokemons={pokemons} />} />
      <Route path="/home" element={<Home />} />
    </Routes> 
  }

  return <AccountContext.Provider value={{ account, updateAccount }}>
    { routes }
  </AccountContext.Provider>
}

export default App;
