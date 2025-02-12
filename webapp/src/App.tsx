import { Route, Routes } from "react-router-dom";
import LogIn from "./login/Login";
import Welcome from "./welcome/Welcome";
import { useFetchUser } from "./utils/hooks/useFetchUser";
import { UserContext } from "./utils/contexts/UserContext";
import CircularProgress from "@mui/material/CircularProgress";
import AppTheme from "./sharedTheme/AppTheme";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
 
function App() {
  const { user, error, loading } = useFetchUser();

  if (loading) {
    return <AppTheme>
      <CssBaseline enableColorScheme />
        <Box
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
    </AppTheme>
  }

  return <UserContext.Provider value={{ user }}>
    { user && !error ?
      <Routes>
        <Route path="/" element={<LogIn />} />
        <Route path="/welcome" element={<Welcome />} />
      </Routes> :
      <Routes>
        <Route path="/" element={<LogIn />} />
      </Routes>
    }
  </UserContext.Provider>
}

export default App;
