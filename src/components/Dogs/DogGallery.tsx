import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";

type DogProps = {
  message: string[]; // Array of image URLs
  status: string; // API success status
};

// Fetch dog images
const fetchDogs = async ({ pageParam = 1 }): Promise<DogProps> => {
  const res = await fetch("https://dog.ceo/api/breeds/image/random/10");
  if (!res.ok) throw new Error("Failed to fetch dogs");
  return res.json();
};

export default function DogGallery() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery<DogProps>({
      queryKey: ["dogs"],
      queryFn: fetchDogs,
      getNextPageParam: (_, allPages) => allPages.length + 1,
    });

  const { ref } = useInView({
    threshold: 1.0,
    onChange: (inView) => inView && hasNextPage && fetchNextPage(),
  });

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-5">
        🐶 Infinite Dog Gallery
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 w-full max-w-5xl px-4">
        {data?.pages.map((page, pageIndex) =>
          page.message.map((url, index) => (
            <img
              key={`${pageIndex}-${index}`}
              src={url}
              alt="Dog"
              className="w-full h-40 object-cover rounded-lg shadow-md transition-transform transform hover:scale-105"
            />
          ))
        )}
      </div>

      <div ref={ref} className="mt-5 text-lg font-semibold text-gray-600">
        {isFetchingNextPage
          ? "Loading more dogs... 🐾"
          : "Scroll down for more!"}
      </div>
    </div>
  );
}
