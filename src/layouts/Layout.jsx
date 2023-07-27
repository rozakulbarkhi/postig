import Sidebar from "../components/Sidebar";
import withAuth from "../hooks/withAuth";

const Layout = ({ children }) => {
  return <Sidebar>{children}</Sidebar>;
};

export default withAuth(Layout);
