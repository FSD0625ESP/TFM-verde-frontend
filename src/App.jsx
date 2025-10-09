import './App.css'
import { HeroUIProvider } from "@heroui/system";
import { Button } from "@heroui/button";


function App() {

  return (
    <>
      <HeroUIProvider>
        <Button>Press me</Button>
      </HeroUIProvider>
    </>
  )
}

export default App