import { GenreResponseProps } from '../@types/entities';

interface HeaderProps {
  selectedGenre: GenreResponseProps;
}

export function Header({ selectedGenre } :HeaderProps) {
  return (
    <header>
      <span className="category">Categoria:<span> {selectedGenre.title}</span></span>
    </header>
  )
}