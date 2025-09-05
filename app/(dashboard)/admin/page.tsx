"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { deletePoll } from "@/app/lib/actions/poll-actions";
import { createClient } from "@/lib/supabase/client";

interface Poll {
  id: string;
  question: string;
  user_id: string;
  created_at: string;
  options: string[];
}

/**
 * Renders the administrative dashboard page for managing all polls in the system.
 *
 * @description
 * This client-side component serves as the central hub for administrators to oversee and moderate content.
 * Unlike regular users who can only manage their own polls, an admin accessing this page can view and delete
 * any poll created by any user. This is crucial for maintaining the application's integrity by removing
 * spam, inappropriate content, or test data.
 *
 * The component fetches all polls directly from the Supabase database on mount. It then displays them in a list
 * of cards, with each card providing details about the poll and an option to delete it.
 *
 * @component
 * @returns {JSX.Element} The rendered admin page.
 *
 * @logic
 * - **State Management**: Uses `useState` to manage the list of `polls`, a `loading` state for the initial data fetch,
 *   and a `deleteLoading` state to provide feedback when a deletion is in progress.
 * - **Data Fetching**: On component mount, `useEffect` calls `fetchAllPolls`, which uses the client-side Supabase
 *   instance to retrieve all records from the 'polls' table.
 * - **Deletion Handling**: The `handleDelete` function is triggered by the "Delete" button. It first asks for user
 *   confirmation, then calls the `deletePoll` server action to perform the secure deletion on the backend.
 *   Upon successful deletion, it optimistically updates the UI by removing the poll from the local state.
 *
 * @connects_to
 * - **`@/app/lib/actions/poll-actions`**: Invokes the `deletePoll` server action to handle the deletion logic securely.
 * - **`@/lib/supabase/client`**: Uses the client-side Supabase SDK to fetch a list of all polls.
 * - **`@/components/ui/*`**: Leverages ShadCN UI components like `Card` and `Button` for a consistent look and feel.
 *
 * @assumptions
 * - **Admin Access**: It is assumed that routing or a higher-order component restricts access to this page to only
 *   users with an 'admin' role. This component itself does not perform role-based access control.
 * - **Supabase RLS**: The Supabase Row Level Security (RLS) policy for the `polls` table must be configured to
 *   allow users with an 'admin' role to perform `SELECT` operations on all rows.
 *
 * @edge_cases
 * - **No Polls**: If no polls are found in the database, a message "No polls found in the system" is displayed.
 * - **Fetch Failure**: If the `fetchAllPolls` function fails (e.g., due to network error or RLS misconfiguration),
 *   the loading state will end, and an empty page will be shown.
 * - **Deletion Failure**: If the `deletePoll` action returns an error, the loading state on the button is removed,
 *   and the poll remains in the list, providing implicit feedback that the operation failed.
 * - **Empty Options**: The component gracefully handles polls that may have no options by displaying a fallback message.
 */
export default function AdminPage() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchAllPolls();
  }, []);

  const fetchAllPolls = async () => {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("polls")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setPolls(data);
    }
    setLoading(false);
  };

  const handleDelete = async (pollId: string) => {
    if (!confirm("Are you sure you want to delete this poll?")) {
      return;
    }

    setDeleteLoading(pollId);
    const result = await deletePoll(pollId);

    if (!result.error) {
      setPolls(polls.filter((poll) => poll.id !== pollId));
    }

    setDeleteLoading(null);
  };

  if (loading) {
    return <div className="p-6">Loading all polls...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <p className="text-gray-600 mt-2">
          View and manage all polls in the system.
        </p>
      </div>

      <div className="grid gap-4">
        {polls.map((poll) => (
          <Card key={poll.id} className="border-l-4 border-l-blue-500">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{poll.question}</CardTitle>
                  <CardDescription>
                    <div className="space-y-1 mt-2">
                      <div>
                        Poll ID:{" "}
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                          {poll.id}
                        </code>
                      </div>
                      <div>
                        Owner ID:{" "}
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                          {poll.user_id}
                        </code>
                      </div>
                      <div>
                        Created:{" "}
                        {new Date(poll.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </CardDescription>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(poll.id)}
                  disabled={deleteLoading === poll.id}
                >
                  {deleteLoading === poll.id ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <h4 className="font-medium">Options:</h4>
                <ul className="list-disc list-inside space-y-1">
                  {poll.options && Array.isArray(poll.options) && poll.options.length > 0 ? (
                    poll.options.map((option, index) => (
                      <li key={index} className="text-gray-700">
                        {option}
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500">No options available.</li>
                  )}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {polls.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No polls found in the system.
        </div>
      )}
    </div>
  );
}
