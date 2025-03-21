import { Route, Routes } from 'react-router-dom';

// lato font family
import '@fontsource/lato';
import '@fontsource/lato/400.css';
import '@fontsource/lato/400-italic.css';

import PrivateRoute from './components/security/route/PrivateRoute';
import PublicRoute from './components/security/route/PublicRoute';

// Pages
import {
  Home, NotFound, SignIn, SignUp, Offer, Confirm, ResetPassword,
  ClientDashboard, ClientProfile, ClientTestStart, ClientQuiz,
  Dashboard, Test, AllUser, User, Archive, Employees, InspectorAdmin,
  Category, Profile, ConfirmSignUp, TestVisual,
  Address, ClientQuizResult
} from './pages';

function App() {

  const renderRoute = (path: string, Component: React.FC, isPrivate: boolean = true) => {
    const RouteWrapper = isPrivate ? PrivateRoute : PublicRoute;
    return (
      <Route
        path={path}
        element={
          <RouteWrapper>
            <Component />
          </RouteWrapper>
        }
      />
    );
  };

  return (
    <>
      <Routes>
        {renderRoute("/", Home)}
        <Route path="*" element={<NotFound />} />

        {/* Authentication Routes */}
        {renderRoute("/auth/SignIn", SignIn, false)}
        {renderRoute("/auth/SignUp", SignUp, false)}
        {renderRoute("/auth/confirm", Confirm, false)}
        {renderRoute("/auth/confirm-signup", ConfirmSignUp, false)}
        {renderRoute("/auth/reset-password", ResetPassword, false)}
        {renderRoute("/auth/offer", Offer, false)}

        {/* Protected Client Routes */}
        {renderRoute("/client/dashboard", ClientDashboard)}
        {renderRoute("/client/quiz/result", ClientQuizResult)}
        {renderRoute("/client/profile", ClientProfile)}
        {renderRoute("/client/test/start", ClientTestStart)}
        {renderRoute("/client/quiz/:id", ClientQuiz)}

        {/* Protected Admin Routes */}
        {renderRoute("/dashboard", Dashboard)}
        {renderRoute("/category", Category)}
        {renderRoute("/test", Test)}
        {renderRoute("/javobniKurish", TestVisual)}
        {renderRoute("/all-user", AllUser)}
        {renderRoute("/user", User)}
        {renderRoute("/archive/:resultId", Archive)} {/* To'g'ri yo'nalish */}
        {renderRoute("/employees", Employees)}
        {renderRoute("/profile", Profile)}
        {renderRoute("/address", Address)}
        {renderRoute("/inspector-admin", InspectorAdmin)}
      </Routes>
    </>
  );
}

export default App;
