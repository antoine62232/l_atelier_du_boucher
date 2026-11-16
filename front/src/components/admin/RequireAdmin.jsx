import { Navigate } from "react-router-dom";
import { estAdmin } from "../../utils/auth";

const RequireAdmin = ({ children }) => {
  if (!estAdmin()) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default RequireAdmin;
