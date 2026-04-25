/**
 * @file App.jsx
 * @description Route definitions for Find Podo.
 * Only one route for now — the main investigation page.
 */

import { Routes, Route } from 'react-router-dom';
import InvestigationPage from './pages/InvestigationPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<InvestigationPage />} />
    </Routes>
  );
}
