const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-lg">
            <div className="container-lg">
                <a className="navbar-brand" href="/">Shop</a>
                <button className="navbar-toggler" type="button"
                    data-bs-toggle="collapse" data-bs-target="#navbarNav"
                    aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <a className="nav-link" href="/recipes">Meals</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/pantry">Pantry</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/list">List</a>
                        </li>
                    </ul>
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <a className="nav-link" href="/settings">Settings</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>

    );
};

export default Navbar;
