import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import ProfileMaker from "@/pages/profile-maker";
import TemplateManagement from "@/pages/admin/template-management";

function Router() {
  return (
    <Switch>
      <Route path="/" component={ProfileMaker} />
      <Route path="/admin/templates" component={TemplateManagement} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;