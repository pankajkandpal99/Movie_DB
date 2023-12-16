import { useEffect, useState } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { SlMenu } from "react-icons/sl";
import { VscChromeClose } from "react-icons/vsc";
import { useLocation, useNavigate } from "react-router-dom";
import ContentWrapper from "../contentWrapper/ContentWrapper";
import logo from "../../assets/movix-logo.svg";

import "./style.scss";

const Header = () => {
  const [show, setShow] = useState("top");
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileMenu, setMobileMenu] = useState(false);            // this state is only for mobile or small than 760px devices....
  const [query, setQuery] = useState("");                        // this state is for searchBar...
  const [showSearch, setShowSearch] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);                                        // jab bhi page ka route change hoga tab window.scroll ki value fir se 0 se start hogi.... kyuki ye hamara spa hai to jab bhi hum kisi bhi route ko active karenge ya wo click karne per active hoga to scroll 0 se start hoga... 

  const controlNavbar = () => {
    // console.log(window.scrollY);                   // ye property user ke dwara page per kiye gaye scroll ko note karti hai ...
    if (window.scrollY > 200) {                    // Agar user ne 200 pixels se jyada scroll kiya hai...
      // window.scroll ki value 200 se jyada hone per ye code run hoga..
      if (window.scrollY > lastScrollY && !mobileMenu) {          // // Agar user ne last scroll se zyada scroll kiya hai aur mobile menu open nahi hai...
        setShow("hide");                                     // Toh Navbar ko hide karo.
      } else {
        setShow("show");                              // Aur agar nahi, toh Navbar ko dikhao.
      }
    } else {
      setShow("top");                                 // Agar user ne 200 pixels se kam scroll kiya hai, toh Navbar ko top par rakh do.
    }
    setLastScrollY(window.scrollY);                  // Last scroll position ko update karo.initially window ki scrollY property 0 hoti hai ....jab hum page ko neeche ko scroll karte jayenge tab ye scroll property 0 se badhti jayegi...
  };

  useEffect(() => {
    window.addEventListener("scroll", controlNavbar);
    // after unmount the component ...
    return () => {
      window.removeEventListener("scroll", controlNavbar);                // Scroll event listener ko remove karo.
    };
  }, [lastScrollY]);                                       // useEffect, lastScrollY par depend karega, agar lastScrollY change hota hai toh fir useEffect chalega.


  const navigationHandler = (type) => {
    if (type === "movie") {
      navigate("/explore/movie");
    } else {
      navigate("/explore/tv");
    }
    setMobileMenu(false); // for mobile view -> Movies per click karne ke baad mobileMenu false ho jayega..
  };

  const openSearch = () => {
    setMobileMenu(false);
    setShowSearch(true);
  };

  const openMobileMenu = () => {
    setMobileMenu(true);
    setShowSearch(false);
  };

  const searchQueryHandler = (event) => {
    if (event.key === "Enter" && query.length > 0) {
      navigate(`/search/${query}`);
      setTimeout(() => {
        setShowSearch(false);
      }, 1000);
    }
  };

  return (
    <header className={`header ${mobileMenu ? "mobileView" : ""} ${show}`}>
      <ContentWrapper>
        <div className="logo" onClick={() => navigate('/')}>
          <img src={logo} alt="" />
        </div>
        <ul className="menuItems">
          <li className="menuItem" onClick={() => navigationHandler("movie")}>
            Movies
          </li>
          <li className="menuItem" onClick={() => navigationHandler("tv")}>
            TV Shows
          </li>
          <li className="menuItem">
            <HiOutlineSearch onClick={openSearch} />
          </li>
        </ul>
        <div className="mobileMenuItems">
          <HiOutlineSearch onClick={openSearch} />
          {mobileMenu ? (
            <VscChromeClose onClick={() => setMobileMenu(false)} />
          ) : (
            <SlMenu onClick={openMobileMenu} />
          )}
        </div>
      </ContentWrapper>

      {showSearch && (
        <div className="searchBar">
          <ContentWrapper className="contentWrapper">
            <div className="searchInput">
              <input
                type="text"
                placeholder="Search for a movie or TV show..."
                onChange={(ev) => setQuery(ev.target.value)}
                onKeyUp={searchQueryHandler}
              />
              <VscChromeClose onClick={() => setShowSearch(false)} />
            </div>
          </ContentWrapper>
        </div>
      )}
    </header>
  );
};

export default Header;
