import { Route, Routes } from "react-router-dom";
import LogIn from "./login/Login";
import AccountEdit from "./edit/AccountEdit";
import { useFetchAccount } from "./utils/hooks/useFetchAccount";
import { AccountContext } from "./utils/contexts/AccountContext";
import { LoadingOverlay } from "./sharedComponents/pages/LoadingOverlay";
import Home from "./home/Home";
import Downtime from "./sharedComponents/pages/Downtime";
import { useFetchPokemons } from "./utils/hooks/useFetchPokemons";
import MyAccount from "./myaccount/MyAccount";
import NotFound from "./sharedComponents/pages/NotFound";
import RedirectToIndex from "./sharedComponents/pages/RedirectToIndex";
import Welcome from "./welcome/Welcome";
 
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
    let welcomeElement = <Welcome />;
    let homeElement = <Home pokemons={pokemons} />;
    let accountEditElement = <AccountEdit />;
    let pokemonEditElement = <AccountEdit />;
    let myAccountElement = <MyAccount pokemons={pokemons} />;
    if (!user || accountError) {
      // not logged in
      welcomeElement = homeElement = accountEditElement = pokemonEditElement = myAccountElement = <RedirectToIndex />;
    }
    else if (!account) {
      // no account set up
      homeElement = accountEditElement = pokemonEditElement = myAccountElement = <RedirectToIndex />;
    }

    routes = <Routes>
      <Route path="/" element={<LogIn />} />
      <Route path="/welcome" element={welcomeElement} />
      <Route path="/home" element={homeElement} />
      <Route path="/accountedit" element={accountEditElement} />
      <Route path="/pokemonedit" element={pokemonEditElement} />
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
