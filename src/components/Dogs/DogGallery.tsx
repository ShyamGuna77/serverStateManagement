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

export default function DogGallery(){


  
  return (
    <>
    </>
  )
}