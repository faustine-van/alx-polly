import { getPollById } from '@/app/lib/actions/poll-actions';
import { notFound } from 'next/navigation';
// Import the client component
import EditPollForm from './EditPollForm';

export default async function EditPollPage({ params }: { params: Promise<{ id: string }> }) {
  // Await the params Promise before accessing properties
  const resolvedParams = await params;
  const { poll, error } = await getPollById(resolvedParams.id);

  if (error || !poll) {
    notFound();
  }

  return (
    <div className="max-w-md mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Poll</h1>
      <EditPollForm poll={poll} />
    </div>
  );
}