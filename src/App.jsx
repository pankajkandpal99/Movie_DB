import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchDataFromApi } from "./utils/api";
import { getApiConfiguration, getGenres } from "./store/homeSlice";
import HomePage from "./pages/home/HomePage";
import DetailsPage from "./pages/details/DetailsPage";
import SearchResultPage from "./pages/searchResult/SearchResultPage";
import ExplorePage from "./pages/explore/ExplorePage";
import PageNotFound from "./pages/404/PageNotFound";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";

function App() {
  const dispatch = useDispatch();
  const { url } = useSelector((state) => state.home); // neeche saved api ke data ko access kiya ja ra hai ... ye home redux store se direct return ho ra hai ...
  // console.log(url);

  useEffect(() => {
    fetchApiConfig();
    genresCall();
  }, []);

  const fetchApiConfig = () => {
    fetchDataFromApi("/configuration").then((res) => {
      // console.log(res);
      const url = {
        backdrop: res.images.secure_base_url + "original",
        poster: res.images.secure_base_url + "original",
        profile: res.images.secure_base_url + "original",
      };

      dispatch(getApiConfiguration(url)); // api ke response se received data redux store me save ho gaya hai ....
    });
  };

  const genresCall = async () => {         // TMDB ki site se movie ka genres call lagane ke liye ye function use kiya gaya hai..
    let promises = [];
    let endPoints = ["tv", "movie"]; // movie ke liye endPoint genres ka --> /genre/movie/list.. aur tv ke liye genre endpoint --> /genre/tv/list... ye endpoints IMDB ki official apis hain...
    let allGenres = {};
    endPoints.forEach((url) => {
      return promises.push(fetchDataFromApi(`/genre/${url}/list`));
    });

    const data = await Promise.all(promises); // promise.all ka ye fayda hai ki jab tak wo 2 api calls complet nahi ho jayengi tab tk hame response nahi milega. iska matlab hai ki hame dono ka response ek saath milega... ab isme 2 api call isliye hongi kyuki endpoints wale array me humne 2 hi values di hui hain.... to unhi ke liye api call hogi aur dono endpoints ka result promises wale array me store ho jayenge...
    // console.log(data);
    data.map(({ genres }) => {             // hame data array ke andar genres naam ka object milega jiske andar array me hame key-value pair me multiple values milengi...
      return genres.map((item) => (allGenres[item.id] = item)); // isme humne id ko hi key bana liya hai, aur uss key ke andar uss particular objetc ki id aur uss genres ka name paas kiya gya hai jo ki ye define karta hai ki uss movie ka naam aur uska genres diya gaya hai.... isme humne allGenres array ke key me jo ki item.id hai usme humne poora item object hi paas kar diya hai...
    });

    // console.log(allGenres);                  // iske andar kuchh iss shape ka data rahega --> 12 : {id: 12, name: 'Adventure'} --> id : { id: item.id, name: item.name}
    dispatch(getGenres(allGenres));             // getGenres action ke andar allGenres object ko pass kiya gaya hai jo ki homeSlice ko dispatch(bheja) ja ra hai jisse ki wo apne homeSlice ki genres state ko update kar sake..
  };

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/:mediaType/:id" element={<DetailsPage />} />
        <Route path="/search/:query" element={<SearchResultPage />} />
        <Route path="/explore/:mediaType" element={<ExplorePage />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
