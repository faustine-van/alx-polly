'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { getPollById, submitVote, hasUserVoted } from '@/app/lib/actions/poll-actions';
import { useAuth } from '@/app/lib/context/auth-context';
import { useRouter } from 'next/navigation';

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

export default function PollDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { user } = useAuth();
  const resolvedParams = use(params);
  const [poll, setPoll] = useState<Poll | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPoll = async () => {
      if (!resolvedParams.id) {
        setError('Poll ID is missing.');
        setLoading(false);
        return;
      }
      
      try {
        const { poll, error } = await getPollById(resolvedParams.id);
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
        
        // Check if user has already voted
        if (user) {
          const { hasVoted: userHasVoted, error: voteCheckError } = await hasUserVoted(resolvedParams.id, user.id);
          if (!voteCheckError) {
            setHasVoted(userHasVoted);
          }
        }
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load poll. Please try again.');
        setLoading(false);
      }
    };

    fetchPoll();
  }, [resolvedParams.id, user]);

  const totalVotes = poll?.options?.reduce((sum, option) => sum + option.votes, 0) || 0;

  const handleVote = async () => {
    if (selectedOptionIndex === null || !poll) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await submitVote(poll.id, selectedOptionIndex);
      if (error) {
        setError(error);
      } else {
        setHasVoted(true);
        // Re-fetch poll to update vote counts
        const { poll: updatedPoll, error: fetchError } = await getPollById(poll.id);
        if (updatedPoll) setPoll(updatedPoll);
        if (fetchError) setError(fetchError);
      }
    } catch (err) {
      setError('Failed to submit vote. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPercentage = (votes: number) => {
    if (totalVotes === 0) return 0;
    return Math.round((votes / totalVotes) * 100);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      // You could add a toast notification here
      console.log('Link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy link:', err);
      // Fallback for browsers that don't support clipboard API
      try {
        const textArea = document.createElement('textarea');
        textArea.value = window.location.href;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        console.log('Link copied to clipboard (fallback)!');
      } catch (fallbackErr) {
        console.error('Fallback copy failed:', fallbackErr);
      }
    }
  };

  const handleShareTwitter = () => {
    const tweetText = `Check out this poll: ${poll?.question}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(window.location.href)}`;
    window.open(twitterUrl, '_blank', 'noopener,noreferrer');
  };

  const handleDeletePoll = async () => {
    if (!poll || !user || user.id !== poll.user_id) return;
    
    if (window.confirm('Are you sure you want to delete this poll? This action cannot be undone.')) {
      try {
        // You'll need to implement deletePoll action
        // const { error } = await deletePoll(poll.id);
        // if (!error) {
        //   router.push('/polls');
        // } else {
        //   setError('Failed to delete poll. Please try again.');
        // }
        console.log('Delete functionality not implemented yet');
      } catch (err) {
        setError('Failed to delete poll. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-500">
              <h2 className="text-xl font-semibold mb-2">Error</h2>
              <p>{error}</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="max-w-3xl mx-auto py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Poll Not Found</h2>
              <p className="text-gray-500 mb-4">The poll you're looking for doesn't exist or has been removed.</p>
              <Button asChild>
                <Link href="/polls">Back to Polls</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/polls" className="text-blue-600 hover:underline flex items-center">
          <span className="mr-1">&larr;</span>
          Back to Polls
        </Link>
        {user && user.id === poll.user_id && (
          <div className="flex space-x-2">
            <Button variant="outline" asChild>
              <Link href={`/polls/${resolvedParams.id}/edit`}>Edit Poll</Link>
            </Button>
            <Button 
              variant="outline" 
              className="text-red-500 hover:text-red-700 hover:border-red-300"
              onClick={handleDeletePoll}
            >
              Delete
            </Button>
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{poll.question}</CardTitle>
          {poll.description && (
            <CardDescription className="text-base">{poll.description}</CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {!hasVoted && user ? (
            <div className="space-y-3">
              <h3 className="font-medium text-gray-700">Choose your answer:</h3>
              {poll.options.map((option, index) => (
                <div 
                  key={option.id} 
                  className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedOptionIndex === index 
                      ? 'border-blue-500 bg-blue-50 shadow-sm' 
                      : 'hover:bg-gray-50 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedOptionIndex(index)}
                  role="radio"
                  aria-checked={selectedOptionIndex === index}
                  tabIndex={0}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setSelectedOptionIndex(index);
                    }
                  }}
                >
                  <div className="flex items-center">
                    <div 
                      className={`w-4 h-4 rounded-full border-2 mr-3 ${
                        selectedOptionIndex === index 
                          ? 'border-blue-500 bg-blue-500' 
                          : 'border-gray-300'
                      }`}
                    >
                      {selectedOptionIndex === index && (
                        <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                      )}
                    </div>
                    <span className="text-sm font-medium">{option.text}</span>
                  </div>
                </div>
              ))}
              <Button 
                onClick={handleVote} 
                disabled={selectedOptionIndex === null || isSubmitting} 
                className="w-full mt-6"
                size="lg"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Vote'}
              </Button>
            </div>
          ) : !user ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">You need to be logged in to vote on this poll.</p>
              <Button asChild>
                <Link href="/login">Login to Vote</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">Poll Results</h3>
                <span className="text-sm text-gray-500">You have voted</span>
              </div>
              {poll.options.map((option) => (
                <div key={option.id} className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium">{option.text}</span>
                    <span className="text-gray-600">
                      {getPercentage(option.votes)}% ({option.votes} votes)
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3">
                    <div 
                      className="bg-blue-600 h-3 rounded-full transition-all duration-300 ease-in-out" 
                      style={{ width: `${getPercentage(option.votes)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
              <div className="text-sm text-gray-500 pt-4 border-t">
                <strong>Total votes: {totalVotes}</strong>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="text-sm text-gray-500 flex justify-between bg-gray-50">
          <p>Created by: {poll.user_id}</p>
          <p>Created: {new Date(poll.createdAt).toLocaleDateString()}</p>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Share this poll</CardTitle>
          <CardDescription>
            Help others discover this poll by sharing it
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button variant="outline" onClick={handleCopyLink} className="flex items-center justify-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy Link
            </Button>
            <Button variant="outline" onClick={handleShareTwitter} className="flex items-center justify-center">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
              Share on Twitter
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}