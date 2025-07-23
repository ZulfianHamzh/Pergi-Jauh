import { getEventById } from '@/lib/data';
import EditEventForm from './EditEventForm';

export default async function EditEventPage({ params }) {
  const event = await getEventById(params.id);

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex justify-center items-center">
        <p className="text-gray-600">Event tidak ditemukan.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#679CBC] p-6 flex justify-center items-center">
        <EditEventForm event={event} />;
    </div>
  ) 
}
