
import { QueryClientProvider,QueryClient } from "@tanstack/react-query";
import Posts from "./components/Posts";


const queryClient = new QueryClient()

function App() {
  return (
    <>
      <QueryClientProvider client ={queryClient}>
        <div className="text-center font-bold text-purple-500 m-6 p-7">
          <h1 className="text-xl">Blog Posts</h1>
          <Posts />
        </div>
      </QueryClientProvider>
    </>
  );
}

export default App;
