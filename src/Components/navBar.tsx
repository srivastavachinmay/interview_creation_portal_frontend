import { Link } from "react-router-dom";
import './navBar.css';

const NavBar = () => {
    return (
        <nav className="navbar">
            <h1>Interview Creation Platform</h1>
            <div className="links">
                <Link to="/" className={'red-btn'} type={'button'}>
                    Home
                </Link>
                <Link to="/schedule" className="red-btn" type={'button'}>
                    Create Interview
                </Link>
            </div>
        </nav>
    );
};

export default NavBar;