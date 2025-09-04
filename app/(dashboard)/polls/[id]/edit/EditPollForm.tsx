'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updatePoll } from '@/app/lib/actions/poll-actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';

interface Poll {
  id: string;
  question: string;
  description?: string;
  options: string[];
}

interface EditPollFormProps {
  poll: Poll;
}

export default function EditPollForm({ poll }: EditPollFormProps) {
  const router = useRouter();
  const [question, setQuestion] = useState(poll.question);
  const [description, setDescription] = useState(poll.description || '');
  const [options, setOptions] = useState(poll.options);
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

    const formData = new FormData();
    formData.append('question', question);
    formData.append('description', description);
    options.forEach(option => {
      if (option.trim()) {
        formData.append('options', option.trim());
      }
    });

    const result = await updatePoll(poll.id, formData);
    
    if (result?.error) {
      setError(result.error);
    } else {
      router.push(`/polls/${poll.id}`);
    }
    
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="question">Poll Question</Label>
        <Input
          id="question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
        />
      </div>

      {/* <div>
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add a description for your poll..."
        />
      </div> */}

      <div>
        <Label>Options</Label>
        {options.map((opt, idx) => (
          <div key={idx} className="flex items-center gap-2 mb-2">
            <Input
              value={opt}
              onChange={(e) => handleOptionChange(idx, e.target.value)}
              placeholder={`Option ${idx + 1}`}
              required
            />
            {options.length > 2 && (
              <Button type="button" variant="destructive" onClick={() => removeOption(idx)}>
                Remove
              </Button>
            )}
          </div>
        ))}
        <Button type="button" onClick={addOption} variant="secondary">
          Add Option
        </Button>
      </div>

      {error && <div className="text-red-500">{error}</div>}

      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting}>
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
  );
}