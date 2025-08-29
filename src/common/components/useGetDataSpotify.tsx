// import useSWR from 'swr';

// Define the interfaces
interface Artist {
  href: string;
  name: string;
}

interface Data {
  currentlyPlaying: boolean;
  albumArt: {
    url: string;
  };
  href: string;
  name: string;
  artists: Artist[];
  playlistHref: string;
  playlistName: string;
}

interface FetcherError {
  message: string;
}

// const fetcher = async (url: string): Promise<Data> => {
//   const res = await fetch(url);
//   if (res.ok) {
//     return res.json();
//   } else {
//     const errorData: FetcherError = await res.json();
//     throw new Error(errorData.message);
//   }
// };

export function useGetDataSpotify() {
  // Spotify functionality disabled
  // const { data, error } = useSWR<Data>('/api/spotify', fetcher);

  return {
    data: null,
    isLoading: false,
    error: 'Spotify functionality disabled',
  };
}
