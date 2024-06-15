import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
    const navigate = useNavigate();
    const [search, setSearch] = useState<string | undefined>();

    function handleSearch(event: any) {
        event.preventDefault();

        navigate(`/?search=${search}`);
    }

    return (
        <>
            <div className="fixed-top mb-5" style={{ backgroundColor: "#05050B" }}>
                <nav className="container col-lg-8 navbar navbar-expand-lg fixed p-3">
                    <div className="container-fluid">
                        <a className="navbar-brand appTitle" href="/">
                            <span className="fs-3 fw-bold navbarTitle text-white">Movies</span>
                        </a>

                        <form className="d-flex w-75" onSubmit={handleSearch}>
                            <div className="input-group">
                                <input
                                    type="text"
                                    name="search"
                                    className="fs-6 form-control"
                                    placeholder="Search Movie Title..."
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </form>
                    </div>
                </nav>
            </div>
        </>
    );
}
