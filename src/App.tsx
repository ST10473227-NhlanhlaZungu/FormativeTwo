import { useEffect, useState } from 'react';
import './App.css';
import FavoritesScreen from './screens/FavoritesScreen';
import HomeScreen from './screens/HomeScreen';
import MenuScreen from './screens/MenuScreen';
import ProfileScreen from './screens/ProfileScreen';
import type { ChefProfile, MenuItem } from './types';

type ScreenName = 'home' | 'menu' | 'favorites' | 'profile';

const starterMenu: MenuItem[] = [
  { id: 'dish-1', name: 'Wild mushroom toast', category: 'Starters', price: 12, description: 'Whipped ricotta, thyme, toasted sourdough', image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=900&q=85', available: true, favorite: true },
  { id: 'dish-2', name: 'Citrus garden salad', category: 'Starters', price: 14, description: 'Bitter leaves, orange, fennel, honey vinaigrette', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=85', available: true, favorite: false },
  { id: 'dish-3', name: 'Sunday tomato rigatoni', category: 'Mains', price: 24, description: 'Slow-roasted tomato, basil, aged pecorino', image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=900&q=85', available: true, favorite: true },
  { id: 'dish-4', name: 'Pan-roasted salmon', category: 'Mains', price: 29, description: 'Crisp skin, spring greens, lemon beurre blanc', image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=900&q=85', available: false, favorite: false },
  { id: 'dish-5', name: 'Olive oil cake', category: 'Desserts', price: 11, description: 'Blood orange, crème fraîche, pistachio', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=85', available: true, favorite: true },
  { id: 'dish-6', name: 'House lemonade', category: 'Drinks', price: 6, description: 'Fresh lemon, rosemary, sparkling water', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765edfd7?auto=format&fit=crop&w=900&q=85', available: true, favorite: false },
];

const starterProfile: ChefProfile = {
  name: 'Cameron Morgan',
  restaurant: 'The Juniper Table',
  email: 'cameron@junipertable.com',
  location: 'Cape Town, South Africa',
};

function readStored<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch {
    return fallback;
  }
}

const navigation: { id: ScreenName; label: string; symbol: string }[] = [
  { id: 'home', label: 'Overview', symbol: '⌂' },
  { id: 'menu', label: 'Menu', symbol: '▤' },
  { id: 'favorites', label: 'Favorites', symbol: '☆' },
  { id: 'profile', label: 'Profile', symbol: '◉' },
];

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ScreenName>('home');
  const [items, setItems] = useState<MenuItem[]>(() => readStored('juniper-menu', starterMenu));
  const [profile, setProfile] = useState<ChefProfile>(() => readStored('juniper-profile', starterProfile));
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [showDishForm, setShowDishForm] = useState(false);

  useEffect(() => localStorage.setItem('juniper-menu', JSON.stringify(items)), [items]);
  useEffect(() => localStorage.setItem('juniper-profile', JSON.stringify(profile)), [profile]);

  const saveDish = (dish: Omit<MenuItem, 'id'>, id?: string) => {
    if (id) {
      setItems((current) => current.map((item) => item.id === id ? { ...dish, id } : item));
    } else {
      setItems((current) => [{ ...dish, id: `dish-${Date.now()}` }, ...current]);
    }
    setShowDishForm(false);
    setEditingItem(null);
  };

  const toggleAvailability = (id: string) => {
    setItems((current) => current.map((item) => item.id === id ? { ...item, available: !item.available } : item));
  };

  const toggleFavorite = (id: string) => {
    setItems((current) => current.map((item) => item.id === id ? { ...item, favorite: !item.favorite } : item));
  };

  const openNewDish = () => {
    setEditingItem(null);
    setShowDishForm(true);
  };

  const openEditDish = (item: MenuItem) => {
    setEditingItem(item);
    setShowDishForm(true);
  };

  const screenProps = {
    items,
    profile,
    onAddDish: openNewDish,
    onEditDish: openEditDish,
    onToggleAvailability: toggleAvailability,
    onToggleFavorite: toggleFavorite,
    onUpdateProfile: setProfile,
    onNavigate: setActiveScreen,
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#home" onClick={(event) => { event.preventDefault(); setActiveScreen('home'); }}>
          <span className="brand-mark">J</span>
          <span><strong>juniper</strong><small>THE TABLE</small></span>
        </a>
        <div className="sidebar-label">WORKSPACE</div>
        <nav className="side-nav" aria-label="Main navigation">
          {navigation.map((item) => (
            <button className={activeScreen === item.id ? 'nav-link active' : 'nav-link'} key={item.id} onClick={() => setActiveScreen(item.id)}>
              <span className="nav-symbol" aria-hidden="true">{item.symbol}</span>{item.label}
              {item.id === 'favorites' && <span className="nav-count">{items.filter((dish) => dish.favorite).length}</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="open-status"><span className="status-dot" />Service is live</div>
          <button className="sidebar-profile" onClick={() => setActiveScreen('profile')}>
            <span className="avatar">{profile.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</span>
            <span><strong>{profile.name}</strong><small>Head chef</small></span>
            <span className="profile-arrow">↗</span>
          </button>
        </div>
      </aside>

      <div className="workspace">
        <header className="topbar">
          <div className="mobile-brand"><span className="brand-mark">J</span><strong>juniper</strong></div>
          <div className="breadcrumb">{profile.restaurant}<span>/</span><strong>{navigation.find((item) => item.id === activeScreen)?.label}</strong></div>
          <div className="topbar-date"><span className="status-dot" />Kitchen dashboard</div>
        </header>
        <main className="page-content">
          {activeScreen === 'home' && <HomeScreen {...screenProps} />}
          {activeScreen === 'menu' && <MenuScreen {...screenProps} />}
          {activeScreen === 'favorites' && <FavoritesScreen {...screenProps} />}
          {activeScreen === 'profile' && <ProfileScreen {...screenProps} />}
        </main>
      </div>

      <nav className="mobile-nav" aria-label="Main navigation">
        {navigation.map((item) => (
          <button className={activeScreen === item.id ? 'mobile-nav-link active' : 'mobile-nav-link'} key={item.id} onClick={() => setActiveScreen(item.id)}>
            <span aria-hidden="true">{item.symbol}</span>{item.label}
          </button>
        ))}
      </nav>

      {showDishForm && <DishDialog item={editingItem} onClose={() => setShowDishForm(false)} onSave={saveDish} />}
    </div>
  );
}

function DishDialog({ item, onClose, onSave }: { item: MenuItem | null; onClose: () => void; onSave: (dish: Omit<MenuItem, 'id'>, id?: string) => void }) {
  const [name, setName] = useState(item?.name ?? '');
  const [category, setCategory] = useState(item?.category ?? 'Mains');
  const [price, setPrice] = useState(item?.price.toString() ?? '');
  const [description, setDescription] = useState(item?.description ?? '');
  const [image, setImage] = useState(item?.image ?? '');
  const [available, setAvailable] = useState(item?.available ?? true);

  return (
    <div className="dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <form className="dish-dialog" onSubmit={(event) => {
        event.preventDefault();
        onSave({ name: name.trim(), category, price: Number(price), description: description.trim(), image: image.trim() || 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85', available, favorite: item?.favorite ?? false }, item?.id);
      }}>
        <div className="dialog-heading"><div><span className="eyebrow">MENU EDITOR</span><h2>{item ? 'Update dish' : 'Add a dish'}</h2></div><button type="button" className="close-button" onClick={onClose} aria-label="Close">×</button></div>
        <label className="field-label">Dish name<input autoFocus required maxLength={60} value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Roasted pumpkin salad" /></label>
        <div className="field-row">
          <label className="field-label">Category<select value={category} onChange={(event) => setCategory(event.target.value)}><option>Starters</option><option>Mains</option><option>Desserts</option><option>Drinks</option></select></label>
          <label className="field-label">Price (R)<input required type="number" min="0" step="0.50" value={price} onChange={(event) => setPrice(event.target.value)} placeholder="0.00" /></label>
        </div>
        <label className="field-label">Description<textarea maxLength={140} rows={3} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="A short description for your guests" /></label>
        <label className="field-label">Photo URL <span className="optional-label">optional</span><input type="url" value={image} onChange={(event) => setImage(event.target.value)} placeholder="https://..." /></label>
        <label className="availability-field"><input type="checkbox" checked={available} onChange={(event) => setAvailable(event.target.checked)} /><span><strong>Available to order</strong><small>Show this dish on the current menu</small></span></label>
        <div className="dialog-actions"><button className="button button-quiet" type="button" onClick={onClose}>Cancel</button><button className="button button-primary" type="submit">{item ? 'Save changes' : 'Add to menu'}</button></div>
      </form>
    </div>
  );
}