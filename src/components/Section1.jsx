// src/components/Section1.jsx
import Image from 'next/image';
import Carousel from './Carousel';
import { getEvents } from '@/lib/data'; // ambil event dari database

export default async function Section1() {
  const events = await getEvents(); // ambil dari database


  const carouselItems = events.map((event) => ({
      id: event.id,
      image: event.image || '/images/no-image.png',
      // Jika nanti kamu ingin menampilkan judul/deskripsi di carousel, bisa tambahkan di sini
      // title: event.title,
      // description: event.description,
    }));

  return (
    <div>
      <h1 className="flex justify-center flex-nowrap items-center flex-col text-black text-3xl font-semibold">
        Wilujeng Sumping
      </h1>
      <br />
      <div className="flex flex-col items-center">
        <Carousel
          items={carouselItems}
          baseWidth={350}
          autoplay={true}
          autoplayDelay={4000}
          pauseOnHover={true}
          loop={true}
          round={false}
        />
      </div>
    </div>
  );
}
