import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchComments, deletePost, updatePost } from "../api";
import { Post, Comment } from "../api";

interface PostDetailProps {
  post: Post;
}

export function PostDetail({ post }: PostDetailProps) {
  const queryClient = useQueryClient();

  // Fetch comments
  const {
    data: comments,
    isLoading,
    error,
  } = useQuery<Comment[]>({
    queryKey: ["comments", post.id],
    queryFn: () => fetchComments(post.id),
  });

  // Delete Post Mutation
  const deleteMutation = useMutation<void, Error, number>({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => {
      console.error("Error deleting post:", error);
    },
  });

  // Update Post Mutation
  const updateMutation = useMutation<
    Post,
    Error,
    { postId: number; data: Partial<Post> }
  >({
    mutationFn: ({ postId, data }) => updatePost(postId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => {
      console.error("Error updating post:", error);
    },
  });

  // Handle Post Deletion
  const handleDelete = () => {
    if (post?.id) {
      deleteMutation.mutate(post.id);
    }
  };

  // Handle Post Update
  const handleUpdate = () => {
    if (post?.id) {
      updateMutation.mutate({
        postId: post.id,
        data: { title: "REACT QUERY FOREVER!!!!" },
      });
    }
  };

  if (isLoading)
    return (
      <p className="text-center text-gray-500 py-8 animate-pulse">
        Loading comments...
      </p>
    );

  if (error)
    return (
      <p className="text-center text-red-500 py-8">Error loading comments</p>
    );

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
        {post.title}
      </h2>
      <p className="text-gray-600 mb-6">{post.body}</p>

      {/* Post actions placed here */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
          className="bg-red-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {deleteMutation.isPending? "Deleting..." : "Delete Post"}
        </button>

        <button
          onClick={handleUpdate}
          disabled={updateMutation.isPending}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {updateMutation.isPending? "Updating..." : "Update Post"}
        </button>
      </div>

      <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
        <span className="mr-2">Comments</span>
        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
          {comments?.length || 0}
        </span>
      </h3>

      {comments?.length ? (
        <ul className="space-y-4">
          {comments.map((comment: Comment) => (
            <li
              key={comment.id}
              className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200"
            >
              <div className="flex items-center mb-2">
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mr-3">
                  {comment.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <strong className="text-gray-800 font-medium block">
                    {comment.name}
                  </strong>
                  <span className="text-gray-500 text-sm">{comment.email}</span>
                </div>
              </div>
              <p className="text-gray-600 ml-11">{comment.body}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500 py-4">No comments yet</p>
      )}
    </div>
  );
}
