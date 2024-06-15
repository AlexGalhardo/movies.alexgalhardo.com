import { BrowserRouter, Route, Routes } from "react-router-dom";
import NotFound from "./components/not-found";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Style.css";
import Movie from "./pages/movie";
import RandomMovie from "./pages/random-movie";
import Genre from "./pages/genre";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<RandomMovie />} />
                <Route path="/movies/*" element={<RandomMovie />} />
                <Route path="/genre/:genre" element={<Genre />} />
                <Route path="/movie/:title" element={<Movie />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}
