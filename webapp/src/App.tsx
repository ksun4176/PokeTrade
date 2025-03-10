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
import PokemonEdit from "./edit/PokemonEdit";
 
function App() {
  const { user, setUser, account, setAccount, accountLoading } = useFetchAccount();
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
    // redirect all valid pages to index
    let welcomeElement = <RedirectToIndex />;
    let homeElement = <RedirectToIndex />;
    let accountEditElement = <RedirectToIndex />;
    let pokemonEditElement = <RedirectToIndex />;
    let myAccountElement = <RedirectToIndex />;
    if (user) { // logged in
      
      if (!account) { // can set up account
        welcomeElement = <Welcome />
      }
      else { // can do trades
        homeElement = <Home pokemons={pokemons} />;
        accountEditElement = <AccountEdit />;
        pokemonEditElement = <PokemonEdit pokemons={pokemons} />;
        myAccountElement = <MyAccount pokemons={pokemons} />;
      }
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
