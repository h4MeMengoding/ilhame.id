/* eslint-disable @typescript-eslint/no-explicit-any */
// import {
//   getAccessToken,
//   getCurrentTrack,
//   getLastPlayedTrack,
//   getTrack,
// } from '@/common/libs/spotify';

export const config = {
  runtime: 'edge',
};

export default async function handler() {
  // Spotify functionality disabled
  return new Response(
    JSON.stringify({ error: 'Spotify functionality disabled' }),
    { status: 200, headers: { 'Content-Type': 'application/json' } },
  );

  // const accessToken = await getAccessToken();
  // if (!accessToken) {
  //   return new Response(
  //     JSON.stringify({ error: 'Error fetching access_token from Spotify' }),
  //     { status: 500, headers: { 'Content-Type': 'application/json' } },
  //   );
  // }

  // const track = await getCurrentTrack(accessToken);
  // if (track) {
  //   const id = track.item.id;
  //   const trackId = await getTrack(accessToken, id);
  //   if (trackId) {
  //     const responsePayload = {
  //       id: track.item.id,
  //       name: track.item.name,
  //       artists: track.item.artists.map((artist: any) => {
  //         return { name: artist.name, href: artist.external_urls.spotify };
  //       }),
  //       href: track.item.external_urls.spotify,
  //       albumArt: track.item.album.images[0],
  //       playlistName: track.item.album.name,
  //       playlistHref: track.item.album.external_urls.spotify,
  //       currentlyPlaying: true,
  //     };
  //     return new Response(JSON.stringify(responsePayload), {
  //       status: 200,
  //       headers: { 'Content-Type': 'application/json' },
  //     });
  //   }
  // }

  // const lastTrack = await getLastPlayedTrack(accessToken);
  // if (lastTrack) {
  //   const responsePayload = {
  //     name: lastTrack.items[0].track.name,
  //     artists: lastTrack.items[0].track.artists.map((artist: any) => {
  //       return { name: artist.name, href: artist.external_urls.spotify };
  //     }),
  //     href: lastTrack.items[0].track.external_urls.spotify,
  //     albumArt: lastTrack.items[0].track.album.images[0],
  //     playlistName: lastTrack.items[0].track.album.name,
  //     playlistHref: lastTrack.items[0].track.album.external_urls.spotify,
  //     currentlyPlaying: false,
  //   };
  //   return new Response(JSON.stringify(responsePayload), {
  //     status: 200,
  //     headers: { 'Content-Type': 'application/json' },
  //   });
  // }

  // return new Response(
  //   JSON.stringify({ error: 'Error fetching data from Spotify' }),
  //   { status: 500, headers: { 'Content-Type': 'application/json' } },
  // );
}
