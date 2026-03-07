import { Navigate } from "react-router-dom";

// Account creation is no longer available – admin access is managed
// via the email whitelist in AuthContext. Redirect to login.
const CreateAccount = () => <Navigate to="/login" replace />;

export default CreateAccount;
