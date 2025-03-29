import { lazy } from "react";
const Hero = lazy(() => import("../components/Home/Hero"));
const Categories = lazy(() => import("../components/Home/Categories"));
const Whyus = lazy(() => import("../components/Home/Whyus"));
const RichCollection = lazy(() => import("../components/Home/RichCollection"));
const ShoeCategory = lazy(() => import("../components/Home/ShoeCategory"));
const ChooseUs = lazy(() => import("../components/Home/ChooseUs"));

const Home = () => {
  return (
    <>
      <Hero />
      <Categories />
      <Whyus />
      <RichCollection />
      <ShoeCategory />
      <ChooseUs />
    </>
  );
};

export default Home;
