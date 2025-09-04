'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { getPollById, submitVote } from '@/app/lib/actions/poll-actions';
interface Poll {
  id: string;
  question: string;
  description: string;
  user_id: string;
  createdAt: string;
  options: {
    id: string;
    text: string;
    votes: number;
  }[];
}
import { useRouter } from 'next/navigation';

export default function PollDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [poll, setPoll] = useState<Poll | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);


  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPoll = async () => {
      if (!params.id) {
        setError('Poll ID is missing.');
        setLoading(false);
        return;
      }
      const { poll, error } = await getPollById(params.id);
      if (error) {
        setError(error);
        setLoading(false);
        return;
      }
      if (!poll) {
        setError('Poll not found.');
        setLoading(false);
        return;
      }
      setPoll(poll);
      setLoading(false);
    };
    fetchPoll();
  }, [params.id]);

  const totalVotes = poll?.options?.reduce((sum, option) => sum + option.votes, 0) || 0;


  const handleVote = async () => {
    if (selectedOptionIndex === null || !poll) return;
    
    setIsSubmitting(true);
    const { error } = await submitVote(poll.id, selectedOptionIndex);
    if (error) {
      setError(error);
    } else {
      setHasVoted(true);
      // Optionally re-fetch poll to update vote counts
      const { poll: updatedPoll, error: fetchError } = await getPollById(poll.id);
      if (updatedPoll) setPoll(updatedPoll);
      if (fetchError) setError(fetchError);
    }
    setIsSubmitting(false);
  };


  // In a real app, you would fetch the poll data based on the ID
  if (loading) {
    return <div className="max-w-3xl mx-auto py-8 text-center">Loading poll...</div>;
  }

  if (error) {
    return <div className="max-w-3xl mx-auto py-8 text-center text-red-500">Error: {error}</div>;
  }

  if (!poll) {
    return <div className="max-w-3xl mx-auto py-8 text-center">Poll not found.</div>;
  }



  const getPercentage = (votes: number) => {
    if (totalVotes === 0) return 0;
    return Math.round((votes / totalVotes) * 100);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/polls" className="text-blue-600 hover:underline">
          &larr; Back to Polls
        </Link>
        <div className="flex space-x-2">
          <Button variant="outline" asChild>
            <Link href={`/polls/${params.id}/edit`}>Edit Poll</Link>
          </Button>
          <Button variant="outline" className="text-red-500 hover:text-red-700">
            Delete
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{poll.question}</CardTitle>
          <CardDescription>{poll.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!hasVoted ? (
            <div className="space-y-3">
              {poll.options.map((option, index) => (
                <div 
                  key={option.id} 
                  className={`p-3 border rounded-md cursor-pointer transition-colors ${selectedOptionIndex === index ? 'border-blue-500 bg-blue-50' : 'hover:bg-slate-50'}`}
                  onClick={() => setSelectedOptionIndex(index)}
                >
                  {option.text}
                </div>
              ))}
              <Button 
                onClick={handleVote} 
                disabled={selectedOptionIndex === null || isSubmitting} 
                className="mt-4"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Vote'}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="font-medium">Results:</h3>
              {poll.options.map((option) => (
                <div key={option.id} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{option.text}</span>
                  <span>{getPercentage(option.votes)}% ({option.votes} votes)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${getPercentage(option.votes)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
              <div className="text-sm text-slate-500 pt-2">
                Total votes: {totalVotes}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="text-sm text-slate-500 flex justify-between">
            <p className="text-sm text-gray-500">Created by: {poll.user_id}</p>
            <p className="text-sm text-gray-500">Created at: {new Date(poll.createdAt).toLocaleString()}</p>
        </CardFooter>
      </Card>

      <div className="pt-4">
        <h2 className="text-xl font-semibold mb-4">Share this poll</h2>
        <div className="flex space-x-2">
          <Button variant="outline" className="flex-1">
            Copy Link
          </Button>
          <Button variant="outline" className="flex-1">
            Share on Twitter
          </Button>
        </div>
      </div>
    </div>
  );
}