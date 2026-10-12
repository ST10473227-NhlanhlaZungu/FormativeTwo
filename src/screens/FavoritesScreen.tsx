import type { ScreenProps } from '../types';

export default function FavoritesScreen({ items, onToggleFavorite, onEditDish, onNavigate }: ScreenProps) {
  const favorites = items.filter((item) => item.favorite);

  return (
    <>
      <header className="page-heading">
        <div><span className="eyebrow">YOUR SHORTLIST</span><h1>Favorites</h1><p>Keep signature dishes close at hand.</p></div>
        <button className="button button-quiet" onClick={() => onNavigate('menu')}>Browse menu</button>
      </header>
      {favorites.length ? <div className="favorites-list">{favorites.map((item) => (
        <div className="favorite-row" key={item.id}>
          <div className="dish-thumb" style={{ backgroundImage: `url("${item.image}")` }} />
          <div className="favorite-name"><strong>{item.name}</strong><small>{item.description}</small></div>
          <span className="favorite-category">{item.category} · R{item.price.toFixed(2)}</span>
          <span className={`availability-chip ${item.available ? 'on' : 'off'}`}>{item.available ? 'Available' : 'Paused'}</span>
          <div className="favorite-actions">
            <button className="favorite-remove" onClick={() => onToggleFavorite(item.id)} aria-label={`Remove ${item.name} from favorites`}>★</button>
            <button className="dish-row-action" onClick={() => onEditDish(item)}>Edit</button>
          </div>
        </div>
      ))}</div> : <div className="empty-state"><strong>No favorites yet</strong>Save a dish from your menu and it will be easy to find here.</div>}
    </>
  );
}
