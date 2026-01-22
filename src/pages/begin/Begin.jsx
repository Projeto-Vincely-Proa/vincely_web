import "./begin.css";
import About from "../../components/begin/about/About";
import Home from "../../components/begin/home/Home";
import Landing from "../../components/begin/landing/Landing";
import Testemonial from "../../components/begin/testemonial/Testemonial";
import Footer from "../../components/begin/footer/Footer";


function Begin() {
    return (
        <>
            <title>Tela de Apresentação | Vincely</title>

                <main>
                    <Home />
                    <About />
                    <Landing />
                    <Testemonial />
                    <Footer />
                </main>
        </>
    );
};


export default Begin;
