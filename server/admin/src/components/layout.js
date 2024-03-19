import Navbar from "./Navbar";
import Head from "./Head";
import Foot from "./Foot";

const Layout = ({ children }) => {
    return (
      <div>
        {/* <Head /> */}
        <Navbar />
        <div className="content">{children}</div>
        <Foot />
      </div>
    );
  };

export default Layout;
  