import type { ScreenProps } from '../types';

const categories = ['Starters', 'Mains', 'Desserts', 'Drinks'];

export default function HomeScreen({ items, profile, onAddDish, onEditDish, onToggleAvailability, onNavigate }: ScreenProps) {
  const availableCount = items.filter((item) => item.available).length;
  const recentItems = items.slice(0, 4);

  return (
    <>
      <header className="page-heading">
        <div>
          <span className="eyebrow">YOUR KITCHEN, AT A GLANCE</span>
          <h1>Hello, Chef {profile.name.split(' ')[0]}</h1>
          <p>A quick look at {profile.restaurant}.</p>
        </div>
      </header>
      <section className="welcome-band">
        <div className="welcome-copy">
          <span className="eyebrow">TODAY'S SERVICE</span>
          <h1>Keep the menu in good shape.</h1>
          <p>Update dishes and availability as the kitchen changes.</p>
          <button className="button button-primary" onClick={onAddDish}><span className="button-symbol">+</span>Add a menu item</button>
        </div>
      </section>
      <div className="overview-grid">
        <section>
          <div className="section-heading">
            <h2>Menu at a glance</h2>
            <button className="text-button" onClick={() => onNavigate('menu')}>Full menu ↗</button>
          </div>
          {recentItems.length ? <div className="dish-list">{recentItems.map((item) => (
            <div className="dish-row" key={item.id}>
              <div className="dish-thumb" style={{ backgroundImage: `url("${item.image}")` }} />
              <div className="dish-row-copy"><strong>{item.name}</strong><small>{item.category} · R{item.price.toFixed(2)}</small></div>
              <span className={`availability-chip ${item.available ? 'on' : 'off'}`}>{item.available ? 'Available' : 'Paused'}</span>
              <button className="dish-row-action" onClick={() => onToggleAvailability(item.id)}>{item.available ? 'Pause' : 'Enable'}</button>
              <button className="dish-row-action" onClick={() => onEditDish(item)}>Edit</button>
            </div>
          ))}</div> : <div className="empty-state"><strong>Your menu starts here</strong>Add your first dish to get service ready.</div>}
        </section>
        <aside className="summary-panel">
          <h2>Menu summary</h2>
          <div className="summary-total"><strong>{items.length}</strong><span>Total menu items</span></div>
          {categories.map((category) => <div className="category-stat" key={category}><span>{category}</span><strong>{items.filter((item) => item.category === category).length}</strong></div>)}
          <div className="category-stat"><span>Available now</span><strong>{availableCount}</strong></div>
          <div className="category-stat"><span>Favorites</span><strong>{items.filter((item) => item.favorite).length}</strong></div>
        </aside>
      </div>
    </>
  );
}
