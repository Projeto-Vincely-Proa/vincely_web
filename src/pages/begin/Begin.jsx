import "./Begin.css";
import About from "../../components/begin/about/About";
import Home from "../../components/begin/home/Home";
import Navbar from "../../components/begin/navbar/Navbar";
import Landing from "../../components/begin/landing/Landing";
import Testemonial from "../../components/begin/testemonial/Testemonial";
import Footer from "../../components/begin/footer/Footer";


function Begin() {
    return (
        <div className="Begin">
            <header>
                <Navbar />
            </header>

             <main>
                <Home />
                <About />
                <Landing />
                <Testemonial />
                <Footer />
            </main>

        </div>

    );
};


export default Begin;
