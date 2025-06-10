const Navbar = () => {
    return (
        <nav class="navbar navbar-expand-lg">
            <div className="container-lg">
                <a class="navbar-brand" href="#">Shop</a>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav">
                        <li class="nav-item active">
                            <a class="nav-link" href="/recipes">Meals</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/pantry">Pantry</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>

    );
};

export default Navbar;
