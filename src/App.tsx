import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Posts from "./components/Blogs/Posts";
import DogGallery from "./components/Dogs/DogGallery";

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <div className="text-center font-bold text-purple-500 m-6 p-7">
          <h1 className="text-xl">Dog Posts</h1>
          {/* <Posts /> */}
          <DogGallery />
        </div>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </>
  );
}

export default App;
