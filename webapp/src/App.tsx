import { Route, Routes } from "react-router-dom";
import LogIn from "./login/Login";
import Welcome from "./welcome/Welcome";
import { useFetchAccount } from "./utils/hooks/useFetchAccount";
import { AccountContext } from "./utils/contexts/AccountContext";
import { Pokemon } from "./utils/types";
import { LoadingOverlay } from "./sharedComponents/LoadingOverlay";
import Home from "./home/Home";
import Downtime from "./downtime/Downtime";
import { useEffect, useState } from "react";
import { getPokemons } from "./utils/apis";
import { Account } from "@prisma/client";
 
function App() {
  const { user, account, setAccount, accountError, accountLoading } = useFetchAccount();
  const [pokemons, setPokemons] = useState<Map<number, Pokemon>>();
  useEffect(() => {
    getPokemons()
      .then(({ data }) => {
        const pokemonMap = new Map(data.map(p => [p.id, p]));
        setPokemons(pokemonMap);
      })
      .catch((error) => {
        console.error(error);
      })
  }, []);

  if (accountLoading) {
    return <LoadingOverlay />
  }

  const updateAccount = (account: Account) => setAccount(account);

  let routes = <Routes></Routes>
  if (!pokemons || pokemons.size === 0) {
    // can't load pokemons (likely connection issue)
    routes = <Routes>
      <Route path="/" element={<Downtime />} />
    </Routes>
  }
  else if (!user || accountError) {
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
      <Route path="/home" element={<Home pokemons={pokemons} />} />
    </Routes> 
  }

  return <AccountContext.Provider value={{ account, updateAccount }}>
    { routes }
  </AccountContext.Provider>
}

export default App;
