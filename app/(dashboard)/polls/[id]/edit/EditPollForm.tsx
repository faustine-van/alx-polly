'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updatePoll } from '@/app/lib/actions/poll-actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';

interface PollOption {
  id: string;
  text: string;
  votes?: number;
}

interface Poll {
  id: string;
  question: string;
  description?: string;
  options: PollOption[] | string[]; // Support both formats
}

interface EditPollFormProps {
  poll: Poll;
}

export default function EditPollForm({ poll }: EditPollFormProps) {
  const router = useRouter();
  const [question, setQuestion] = useState(poll.question);
  const [description, setDescription] = useState(poll.description || '');
  
  // Normalize options to string array
  const normalizeOptions = (options: PollOption[] | string[]): string[] => {
    if (!options || !Array.isArray(options)) {
      return ['', '']; // Default two empty options
    }
    
    // If it's an array of objects with 'text' property
    if (options.length > 0 && typeof options[0] === 'object' && options[0] !== null && 'text' in options[0]) {
      return (options as PollOption[]).map(opt => opt.text || '');
    }
    
    // If it's an array of strings
    if (options.length > 0 && typeof options[0] === 'string') {
      return options as string[];
    }
    
    // Fallback
    return ['', ''];
  };

  const [options, setOptions] = useState<string[]>(normalizeOptions(poll.options));
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOptionChange = (idx: number, value: string) => {
    setOptions(opts => opts.map((opt, i) => (i === idx ? value : opt)));
  };

  const addOption = () => setOptions(opts => [...opts, '']);

  const removeOption = (idx: number) => {
    if (options.length > 2) {
      setOptions(opts => opts.filter((_, i) => i !== idx));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Validate that we have at least 2 non-empty options
    const validOptions = options.filter(option => option.trim() !== '');
    if (validOptions.length < 2) {
      setError('Please provide at least 2 options for your poll.');
      setIsSubmitting(false);
      return;
    }

    if (!question.trim()) {
      setError('Please provide a question for your poll.');
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('question', question.trim());
      formData.append('description', description.trim());
      
      // Add each valid option
      validOptions.forEach(option => {
        formData.append('options', option.trim());
      });

      const result = await updatePoll(poll.id, formData);
      
      if (result?.error) {
        setError(result.error);
      } else {
        router.push(`/polls/${poll.id}`);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Update poll error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Edit Poll</h1>
        <p className="text-gray-600 mt-2">Update your poll question and options.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="question">Poll Question *</Label>
          <Input
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="What would you like to ask?"
            required
            className="mt-1"
          />
        </div>

        {/* <div>
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a description for your poll..."
            className="mt-1"
          />
        </div> */}

        <div>
          <Label>Poll Options *</Label>
          <p className="text-sm text-gray-500 mb-3">
            Provide at least 2 options for your poll. You can add up to 10 options.
          </p>
          <div className="space-y-3">
            {options.map((opt, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="flex-1">
                  <Input
                    value={opt || ''} // Ensure it's always a string
                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                    placeholder={`Option ${idx + 1}`}
                    required={idx < 2} // First two options are required
                    className="w-full"
                  />
                </div>
                {options.length > 2 && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => removeOption(idx)}
                    className="text-red-500 hover:text-red-700 hover:border-red-300"
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
          </div>
          
          {options.length < 10 && (
            <Button 
              type="button" 
              onClick={addOption} 
              variant="outline" 
              className="mt-3"
            >
              Add Option
            </Button>
          )}
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <Button type="submit" disabled={isSubmitting} className="min-w-[120px]">
            {isSubmitting ? 'Updating...' : 'Update Poll'}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => router.push(`/polls/${poll.id}`)}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}