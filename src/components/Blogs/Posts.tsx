import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchPosts } from "../../api";
import { PostDetail } from "./PostDetail";

interface Post {
  userId: number;
  title: string;
  body: string;
  id: number;
}

const maxPage = 10;

const Posts = () => {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const { data, isLoading, error } = useQuery<Post[]>({
    queryKey: ["posts", currentPage],
    queryFn: () => fetchPosts(currentPage + 1),
  });

  useEffect(() => {
    if (currentPage < maxPage) {
      const nextPage = currentPage + 1;
      queryClient.prefetchQuery({
        queryKey: ["posts", nextPage],
        queryFn: () => fetchPosts(nextPage),
      });
    }
  }, [currentPage, queryClient]);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-48 bg-blue-200 mb-4 rounded"></div>
          <div className="h-4 w-64 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 w-56 bg-gray-200 rounded"></div>
          <p className="text-blue-500 mt-4 font-medium">Loading posts...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="p-8 text-center bg-red-50 rounded-lg border border-red-200">
        <p className="text-red-500 font-semibold text-xl">
          Error loading posts
        </p>
        <p className="text-gray-600 mt-2">Please try again later</p>
      </div>
    );

  return (
    <div className="p-6 max-w-5xl mx-auto bg-gradient-to-b from-white to-gray-50 rounded-xl shadow-lg">
      <h1 className="text-5xl font-extrabold mb-8 text-indigo-700 text-center">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
          Blog Posts
        </span>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <ul className="space-y-6">
            {data?.map((post) => (
              <li
                key={post.id}
                className={`bg-white rounded-lg shadow-md p-4 cursor-pointer transform transition duration-300 hover:shadow-lg hover:-translate-y-1 ${
                  selectedPost?.id === post.id ? "ring-2 ring-indigo-500" : ""
                }`}
                onClick={() => setSelectedPost(post)}
              >
                <h2 className="text-xl font-bold mb-2 text-indigo-700 line-clamp-2">
                  {post.title}
                </h2>
                <p className="text-gray-600 line-clamp-3">{post.body}</p>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-xs text-gray-500">Post #{post.id}</span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                    Read more
                    <svg
                      className="ml-1 w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      ></path>
                    </svg>
                  </span>
                </div>
              </li>
            ))}
          </ul>

          <div className="flex justify-between items-center mt-8">
            <button
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50 hover:bg-indigo-700 transition duration-300 flex items-center"
              disabled={currentPage === 0}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
            >
              <svg
                className="w-5 h-5 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                ></path>
              </svg>
              Previous
            </button>
            <span className="text-lg font-medium text-gray-700 bg-white px-4 py-1 rounded-full shadow-sm">
              Page {currentPage + 1} of {maxPage}
            </span>
            <button
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50 hover:bg-indigo-700 transition duration-300 flex items-center"
              disabled={data?.length === 0 || currentPage >= maxPage - 1}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
              <svg
                className="w-5 h-5 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          {selectedPost ? (
            <PostDetail post={selectedPost} />
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <svg
                className="w-16 h-16 text-indigo-300 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                ></path>
              </svg>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No Post Selected
              </h3>
              <p className="text-gray-500">
                Click on a post to view its details
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Posts;
