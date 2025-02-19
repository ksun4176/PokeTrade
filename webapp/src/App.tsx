import { Route, Routes } from "react-router-dom";
import LogIn from "./login/Login";
import Edit from "./edit/Edit";
import { useFetchAccount } from "./utils/hooks/useFetchAccount";
import { AccountContext } from "./utils/contexts/AccountContext";
import { Pokemon } from "./utils/types";
import { LoadingOverlay } from "./sharedComponents/LoadingOverlay";
import Home from "./home/Home";
import Downtime from "./downtime/Downtime";
import { useEffect, useState } from "react";
import { getPokemons } from "./utils/apis";
import { Account } from "@prisma/client";
import MyAccount from "./myaccount/MyAccount";
 
function App() {
  const { user, account, setAccount, accountError, accountLoading } = useFetchAccount();
  const [pokemons, setPokemons] = useState<Map<number, Pokemon>>();
  const updateAccount = (account: Account) => setAccount(account);

  useEffect(() => {
    let ignore = false
    getPokemons()
      .then(({ data }) => {
        if (!ignore) {
          const pokemonMap = new Map(data.map(p => [p.id, p]));
          setPokemons(pokemonMap);
         }
      })
      .catch((error) => {
        console.error(error);
      })
    
    return () => {
      ignore = true;
    };
  }, []);

  if (accountLoading) {
    return <LoadingOverlay />
  }

  let routes = <Routes></Routes>
  if (!pokemons) {
    // can't load pokemons (likely connection issue)
    routes = <Routes>
      <Route path="*" element={<Downtime />} />
    </Routes>
  }
  else if (!user || accountError) {
    // not logged in
    routes = <Routes>
      <Route path="*" element={<LogIn />} />
    </Routes>
  }
  else if (!account) {
    // no account set up
    routes = <Routes>
      <Route path="/" element={<LogIn />} />
      <Route path="/home" element={<Home pokemons={pokemons} />} />
      <Route path="/edit" element={<Edit pokemons={pokemons} />} />
    </Routes>
  }
  else {
    routes = <Routes>
      <Route path="/" element={<LogIn />} />
      <Route path="/home" element={<Home pokemons={pokemons} />} />
      <Route path="/edit" element={<Edit pokemons={pokemons} />} />
      <Route path="/myaccount" element={<MyAccount pokemons={pokemons} />} />
    </Routes> 
  }

  return <AccountContext.Provider value={{ user, account, updateAccount }}>
    { routes }
  </AccountContext.Provider>
}

export default App;
