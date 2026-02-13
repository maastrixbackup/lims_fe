import { AppContent } from "./routes/AppContent";
import { BrowserRouter as Router } from "react-router-dom";


export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
