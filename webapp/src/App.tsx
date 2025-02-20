import { Route, Routes } from "react-router-dom";
import LogIn from "./login/Login";
import Edit from "./edit/Edit";
import { useFetchAccount } from "./utils/hooks/useFetchAccount";
import { AccountContext } from "./utils/contexts/AccountContext";
import { LoadingOverlay } from "./sharedComponents/LoadingOverlay";
import Home from "./home/Home";
import Downtime from "./sharedComponents/Downtime";
import { useFetchPokemons } from "./utils/hooks/useFetchPokemons";
import MyAccount from "./myaccount/MyAccount";
import NotFound from "./sharedComponents/NotFound";
import RedirectToIndex from "./sharedComponents/RedirectToIndex";
 
function App() {
  const { user, setUser, account, setAccount, accountError, accountLoading } = useFetchAccount();
  const { pokemons, pokemonsError, pokemonsLoading } = useFetchPokemons();

  let routes = <Routes></Routes>
  if (pokemonsLoading || accountLoading) {
    routes = <Routes>
      <Route path="*" element={<LoadingOverlay />} />
    </Routes>
  }
  else if (pokemonsError || pokemons.size === 0) {
    // can't load pokemons (likely connection issue)
    routes = <Routes>
      <Route path="*" element={<Downtime />} />
    </Routes>
  }
  else {
    let homeElement = <Home pokemons={pokemons} />;
    let editElement = <Edit pokemons={pokemons} />;
    let myAccountElement = <MyAccount pokemons={pokemons} />;
    if (!user || accountError) {
      // not logged in
      homeElement = editElement = myAccountElement = <RedirectToIndex />;
    }
    else if (!account) {
      // no account set up
      homeElement = myAccountElement = <RedirectToIndex />;
    }

    routes = <Routes>
      <Route path="/" element={<LogIn />} />
      <Route path="/home" element={homeElement} />
      <Route path="/edit" element={editElement} />
      <Route path="/myaccount" element={myAccountElement} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  }

  const logoutUser = () => {
    setAccount(null);
    setUser(null);
  }
  return <AccountContext.Provider value={{ user, logoutUser, account, setAccount }}>
    { routes }
  </AccountContext.Provider>
}

export default App;
