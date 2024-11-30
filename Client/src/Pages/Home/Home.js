import React, {useState, useEffect, useRef} from "react";
import EndPoint from "../../Utils/Endpoint";

import "./Home.css";
function Home() {

    const readSectionRef = useRef(null);
    const writeSectionRef = useRef(null);
    const postSectionRef = useRef(null);
    const repeatSectionRef = useRef(null);

    const scrollToSection = (ref) => {
        const sectionTop = ref.current.offsetTop - 5; // Get the section's position relative to the document
        window.scrollTo({
            top: sectionTop,   // Scroll to the top of the section
            behavior: "smooth" // Enables smooth scrolling
        });
    };

    const [isMobile, setIsMobile] = useState(false);
    //const isMobileRef = useRef(isMobile);
    const [isHidden, setIsHidden] = useState(isMobile);
    const [isScrollingDown, setIsScrollingDown] = useState(false); 
    const [scrollTop, setScrollTop] = useState(true)

    useEffect(() => {
        const mainBody = document.querySelector('.main-body');
        let lastScrollY = mainBody ? mainBody.scrollTop : 0;

        const handleScroll = () => {
            // if(isMobileRef.current) {
            //     setIsScrollingDown(false);
            //     return;
            // }
            //else {
                setIsScrollingDown(window.scrollY > lastScrollY);
                lastScrollY = window.scrollY; 

                setScrollTop(window.scrollY === 0)

            //}
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <>
        <div className="home">
            <div className={`home-header ${scrollTop ? "home-header-top" : ""}`}>
                <div className={`home-header-section home-header-section-read`} onClick={() => scrollToSection(readSectionRef)}>
                    <h1>
                        Read!
                    </h1>
                </div>
                <div className={`home-header-section home-header-section-write`} onClick={() => scrollToSection(writeSectionRef)}>
                    <h1>
                        Write!
                    </h1>
                </div>
                <div className={`home-header-section home-header-section-post`} onClick={() => scrollToSection(postSectionRef)}>
                    <h1>
                        Post!
                    </h1>
                </div>
                <div className={`home-header-section home-header-section-repeat`} onClick={() => scrollToSection(repeatSectionRef)}>
                    <h1>
                        Repeat!
                    </h1>
                </div>
            </div>
            <div className="home-sections">
                <div ref={readSectionRef}>
                    <EndPoint.Pages.HomeSections.ReadSection />
                </div>
                <div ref={writeSectionRef}>
                    <EndPoint.Pages.HomeSections.WriteSection />
                </div>
                <div ref={postSectionRef}>
                    <EndPoint.Pages.HomeSections.PostSection />
                </div>
                <div ref={repeatSectionRef}>
                    <EndPoint.Pages.HomeSections.RepeatSection />
                </div>
            </div>
        </div>
        </>
       
    );
}

export default Home;
