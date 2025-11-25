import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import ScrollToTop from "./components/ScrollToTop";
import ScrollProgress from "./components/ScrollProgress";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Contact from "./pages/Contact";
import Company from "./pages/Company";
import Technology from "./pages/Technology";
import Industries from "./pages/Industries";
import Resources from "./pages/Resources";
import FAQ from "./pages/FAQ";
import Datenschutz from "./pages/Datenschutz";
import Impressum from "./pages/Impressum";
import AGB from "./pages/AGB";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path="/produkte" component={Products} />
      <Route path="/produkte/:id" component={ProductDetail} />
      <Route path="/kontakt" component={Contact} />
      <Route path="/unternehmen" component={Company} />
      <Route path="/technologie" component={Technology} />
      <Route path="/branchen" component={Industries} />
      <Route path="/ressourcen" component={Resources} />
      <Route path="/faq" component={FAQ} />
      <Route path="/datenschutz" component={Datenschutz} />
      <Route path="/impressum" component={Impressum} />
      <Route path="/agb" component={AGB} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}



function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
      // switchable
      >
        <TooltipProvider>
          <Toaster />
          <ScrollProgress />
          <ScrollToTop />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
