import { useState } from 'react';
import type { ScreenProps } from '../types';

const categories = ['All items', 'Starters', 'Mains', 'Desserts', 'Drinks'];

export default function MenuScreen({ items, onAddDish, onEditDish, onToggleAvailability, onToggleFavorite }: ScreenProps) {
  const [category, setCategory] = useState('All items');
  const [search, setSearch] = useState('');
  const filteredItems = items.filter((item) => {
    const matchesCategory = category === 'All items' || item.category === category;
    const matchesSearch = `${item.name} ${item.description} ${item.category}`.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <header className="page-heading">
        <div><span className="eyebrow">THE JUNIPER TABLE</span><h1>Menu</h1><p>{items.length} dishes across your kitchen</p></div>
        <button className="button button-primary" onClick={onAddDish}><span className="button-symbol">+</span>Add dish</button>
      </header>
      <div className="toolbar">
        <label className="search-box"><span aria-hidden="true">⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search your menu" aria-label="Search your menu" /></label>
        <div className="filter-tabs" role="group" aria-label="Filter by category">
          {categories.map((choice) => <button key={choice} className={`filter-tab ${category === choice ? 'active' : ''}`} aria-pressed={category === choice} onClick={() => setCategory(choice)}>{choice}</button>)}
        </div>
      </div>
      <p className="result-count">{filteredItems.length} {filteredItems.length === 1 ? 'dish' : 'dishes'}</p>
      {filteredItems.length ? <div className="menu-grid">{filteredItems.map((item) => (
        <article className="menu-card" key={item.id}>
          <div className="menu-card-image" style={{ backgroundImage: `url("${item.image}")` }}>
            <button className={`favorite-button ${item.favorite ? 'is-favorite' : ''}`} onClick={() => onToggleFavorite(item.id)} aria-label={item.favorite ? 'Remove from favorites' : 'Add to favorites'} aria-pressed={item.favorite}>{item.favorite ? '★' : '☆'}</button>
            <span className={`availability-chip card-status ${item.available ? 'on' : 'off'}`}>{item.available ? 'Available' : 'Paused'}</span>
          </div>
          <div className="menu-card-body">
            <div className="card-meta"><span>{item.category}</span><strong>R{item.price.toFixed(2)}</strong></div>
            <h2>{item.name}</h2>
            <p>{item.description || 'A new addition to the menu.'}</p>
            <div className="menu-card-footer">
              <button className="dish-row-action" onClick={() => onToggleAvailability(item.id)}>{item.available ? 'Pause item' : 'Make available'}</button>
              <button className="dish-row-action" onClick={() => onEditDish(item)}>Edit ↗</button>
            </div>
          </div>
        </article>
      ))}</div> : <div className="empty-state"><strong>No dishes found</strong>Try a different search or category.</div>}
    </>
  );
}
