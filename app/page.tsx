
import Image from "next/image";
import * as React from "react"
import ad1 from '../public/ad1.png'
import ad2 from '../public/ad2.jpg'
import ad3 from '../public/ad3.jpg'

import { SearchBlock } from "../components/searchblock"
import { CarouselBlock } from "../components/carouselblock"
import { CatalogHome } from "../components/cataloghome"
import { ArticlesBlock } from "../components/articlesblock"
import { AboutHome } from "../components/abouthome"

export default function Home() {
  return (
    <main>
      <div className="pt-4">
        
        <div>
          <CatalogHome />
        </div>
        <CarouselBlock />
        
        <SearchBlock />
        <ArticlesBlock />
        <AboutHome />
        
      </div>
      
    </main>
  );
}