import Hero from "./hero";
import About from "./about";
import Programs from "./programs";

import Team from "./team";
import Blog from "./blog";
import Shop from "./shop";
import Contacts from "./contacts";
import Games from "../pages/games";
import Display from "./display";
import Footer from "./footer";
import ScheduleSection from "./schedule";





const Home = () => {
    return (
        <>

            <Hero />
            <About />
            <Programs />
            <Team />
            <Blog />
            <Shop />
            <Contacts />
            {/*<Games />*/}

            <ScheduleSection />
            <Display />

        </>
    )
}
export default Home;