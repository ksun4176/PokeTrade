import { Route, Routes } from "react-router-dom";
import LogIn from "./login/Login";
import Welcome from "./welcome/Welcome";
import { useFetchAccount } from "./utils/hooks/useFetchAccount";
import { AccountContext } from "./utils/contexts/AccountContext";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { useFetchPokemons } from "./utils/hooks/useFetchPokemons";
import { Account } from "./utils/types";
 
function App() {
  const { account, setAccount, accountError, accountLoading } = useFetchAccount();
  const { pokemons, pokemonsError, pokemonsLoading } = useFetchPokemons();

  if (accountLoading || pokemonsLoading) {
    return <Box
      display='flex'
      justifyContent='center'
      alignItems='center'
      position='fixed'
      top={0}
      right={0}
      bottom={0}
      left={0}
    >
      <CircularProgress />
    </Box>
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
