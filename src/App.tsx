import { ThemeProvider } from "@/components/theme-provider";
import NotesApp from "./pages/NotesApp";
import { RecoilRoot } from "recoil";
import "@/App.css"
function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RecoilRoot>
        <NotesApp />
      </RecoilRoot>
    </ThemeProvider>
  );
}

export default App;
