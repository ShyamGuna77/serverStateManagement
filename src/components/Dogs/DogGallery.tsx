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
      queryFn:  fetchDogs,
      getNextPageParam: (lastPage, allPages) => allPages+1
       
    });

  const { ref } = useInView({
    threshold: 1.0,
    onChange: (inView) => inView && hasNextPage && fetchNextPage(),
    triggerOnce: false,
  });

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <h1 className="text-xl text-center m-8 p-6">Infinite Scroll</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 w-max-6xl">
        {data?.pages.map((page, pageIndex) =>
          page.message.map((url, index) => (
            <img
              key={`${pageIndex}-${index}`}
              src={url}
              alt="dog"
              className="h-40 w-full object-cover hover:scale-105 shadow rounded-md"
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
