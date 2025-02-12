import { Route, Routes } from "react-router-dom";
import LogIn from "./login/Login";
import Welcome from "./welcome/Welcome";
import { useFetchUser } from "./utils/hooks/useFetchUser";
import { UserContext } from "./utils/contexts/UserContext";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { useFetchPokemons } from "./utils/hooks/useFetchPokemons";
import { Typography } from "@mui/material";
 
function App() {
  const { user, userError, userLoading } = useFetchUser();
  const { pokemons, pokemonsError, pokemonsLoading } = useFetchPokemons();

  if (userLoading || pokemonsLoading) {
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

  if (!pokemons || pokemonsError) {
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
      <Typography variant="h3">There is an issue. Try again later.</Typography>
    </Box>
  }

  return <UserContext.Provider value={{ user }}>
    { user && !userError ?
      <Routes>
        <Route path="/" element={<LogIn />} />
        <Route path="/welcome" element={<Welcome pokemons={pokemons!} />} />
      </Routes> :
      <Routes>
        <Route path="/" element={<LogIn />} />
      </Routes>
    }
  </UserContext.Provider>
}

export default App;
