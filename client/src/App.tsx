import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import ScrollToTop from "./components/ScrollToTop";
import ScrollProgress from "./components/ScrollProgress";
import PrivacyBanner from "./components/PrivacyBanner";
import Home from "./pages/Home";
import Products from "./pages/Products";
import MachineVisionLaserModules from "./pages/MachineVisionLaserModules";
import ProductDetail from "./pages/ProductDetail";
import Contact from "./pages/Contact";
import Company from "./pages/Company";
import Technology from "./pages/Technology";
import Resources from "./pages/Resources";
import FAQ from "./pages/FAQ";
import Datenschutz from "./pages/Datenschutz";
import Impressum from "./pages/Impressum";
import AGB from "./pages/AGB";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CustomerLogin from "./pages/CustomerLogin";
import Tools from "./pages/Tools";
import MaxPowerSimulation from "./pages/MaxPowerSimulation";
import LineThicknessSimulation from "./pages/LineThicknessSimulation";
import Careers from "./pages/Careers";


function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/customer-login" component={CustomerLogin} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/tools" component={Tools} />
      <Route path="/produkte" component={Products} />
      <Route path="/produkte/machine-vision" component={MachineVisionLaserModules} />
      <Route path="/produkte/:id" component={ProductDetail} />
      <Route path="/kontakt" component={Contact} />
      <Route path="/unternehmen" component={Company} />
      <Route path="/technologie" component={Technology} />
      <Route path="/ressourcen" component={Resources} />
      <Route path="/faq" component={FAQ} />
      <Route path="/datenschutz" component={Datenschutz} />
      <Route path="/impressum" component={Impressum} />
      <Route path="/agb" component={AGB} />
      <Route path="/karriere" component={Careers} />
      <Route path="/tools/maximale-leistung-simulation" component={MaxPowerSimulation} />
      <Route path="/tools/maximum-power-simulation" component={MaxPowerSimulation} />
      <Route path="/tools/liniendickensimulation" component={LineThicknessSimulation} />
      <Route path="/tools/line-thickness-simulation" component={LineThicknessSimulation} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <ThemeProvider
          defaultTheme="light"
        >
          <TooltipProvider>
            <Toaster />
            <ScrollProgress />
            <ScrollToTop />
            <PrivacyBanner />
            <Router />
          </TooltipProvider>
        </ThemeProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App;
