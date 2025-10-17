import "./App.css";
import { HeroUIProvider } from "@heroui/system";
import { Button } from "@heroui/button";
import Login from "./components/Login/Login";

function App() {
  return (
    <>
      {/*}
      <HeroUIProvider>
        <Button>Press me</Button>
      </HeroUIProvider>
      */}
      <Login />
    </>
  );
}

export default App;
