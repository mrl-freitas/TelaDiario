export interface MediaItem {
  id: number;
  title: string;
  poster_path: string;
  media_type: 'movie' | 'tv' | 'anime';
  name?: string; // séries usam "name"
  release_date?: string;
  first_air_date?: string;
}
