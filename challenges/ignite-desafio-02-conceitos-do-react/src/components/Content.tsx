
import { MovieCard } from '../components/MovieCard';
import { GenreResponseProps, MovieProps } from '../@types/entities';
import { Header } from './Header';

interface ContentProps {
  movies: MovieProps[];
  selectedGenre: GenreResponseProps;
}

export function Content({ movies, selectedGenre }: ContentProps) {
  return (
    <div className="container">
    <Header selectedGenre={selectedGenre} />

    <main>
      <div className="movies-list">
        {movies.map(movie => (
          <MovieCard title={movie.Title} poster={movie.Poster} runtime={movie.Runtime} rating={movie.Ratings[0].Value} />
        ))}
      </div>
    </main>
  </div>
  )
}