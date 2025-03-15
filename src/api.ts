export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export interface Comment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

export async function fetchPosts(pageNum: number = 1): Promise<Post[]> {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_limit=10&_page=${pageNum}`
  );
  if (!response.ok) throw new Error("Failed to fetch posts");
  return response.json();
}

// api.ts - Updated version

export async function fetchComments(postId: number): Promise<Comment[]> {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${postId}/comments`
  );
  return response.json();
}

// This function now matches how it's called in the component
export async function deletePost(postId: number): Promise<void> {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${postId}`,
    { method: "DELETE" }
  );
  if (!response.ok) {
    throw new Error(`Failed to delete post with ID ${postId}`);
  }
  // No need to return response.json() as we don't use the result
}

// This function now matches how it's called in the component
export async function updatePost(
  postId: number, 
  data: Partial<Post>
): Promise<Post> {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${postId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );
  if (!response.ok) {
    throw new Error(`Failed to update post with ID ${postId}`);
  }
  return response.json();
}