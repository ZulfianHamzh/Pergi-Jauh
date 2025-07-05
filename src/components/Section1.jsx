import CarouselClientWrapper from './CarouselClientWrapper';
import { getEvents } from '@/lib/data';

export default async function Section1() {
  const events = await getEvents();

  const carouselItems = events.map((event) => ({
    id: event.id,
    image: event.image || '/images/no-image.png',
    title: event.title,
    detailEvent: event.detailEvent,
    linkPendaftaran: event.linkPendaftaran,
  }));

  return (
    <CarouselClientWrapper items={carouselItems} />
  );
}
