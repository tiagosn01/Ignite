import '../styles/sidebar.scss';
import { Button } from './Button';

import { GenreResponseProps, MovieProps } from '../@types/entities';

interface SidebarProps {
  genres: GenreResponseProps[];
  selectedGenreId: number;
  handleClickButton: (id: number) => void;
}

export function SideBar({ genres, handleClickButton, selectedGenreId }: SidebarProps) {

  return (

    <nav className="sidebar">
        <span>Watch<p>Me</p></span>

        <div className="buttons-container">
          {genres.map(genre => (
            <Button
            id={String(genre.id)}
            title={genre.title}
            iconName={genre.name}
            onClick={() => handleClickButton(genre.id)}
            selected={selectedGenreId === genre.id}
            />
            ))}
        </div>

      </nav>
  )
}