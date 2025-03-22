import React from "react";
import { Hero } from "../components/Home/Hero";
import { Categories } from "../components/Home/Categories";
import { Whyus } from "../components/Home/Whyus";
import { RichCollection } from "../components/Home/RichCollection";
import { ShoeCategory } from "../components/Home/ShoeCategory";
import { ChooseUs } from "../components/Home/ChooseUs";
export const Home = () => {
  return (
    <div>
      <Hero />
      <Categories />
      <Whyus />
      <RichCollection />
      <ShoeCategory />
      <ChooseUs />
    </div>
  );
};
