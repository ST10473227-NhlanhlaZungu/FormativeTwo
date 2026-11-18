import { useCallback, useEffect, useState } from 'react';
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
  { id: 'dish-5', name: 'Chocolate lava cake', category: 'Desserts', price: 13, description: 'Warm chocolate sponge, molten centre, vanilla cream', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=85', available: true, favorite: true },
  { id: 'dish-6', name: 'House lemonade', category: 'Drinks', price: 6, description: 'Fresh lemon, rosemary, sparkling water', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765edfd7?auto=format&fit=crop&w=900&q=85', available: true, favorite: false },
];

const starterProfile: ChefProfile = {
  name: 'Cameron Morgan',
  restaurant: 'Christoffel Kitchen',
  email: 'cameron@christoffelkitchen.com',
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
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [items, setItems] = useState<MenuItem[]>(() => {
    const storedItems = readStored('christoffel-menu', starterMenu);
    return storedItems.map((item) => item.id === 'dish-5'
      ? { id: 'dish-5', name: 'Chocolate lava cake', category: 'Desserts', price: 13, description: 'Warm chocolate sponge, molten centre, vanilla cream', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=85', available: true, favorite: item.favorite }
      : item);
  });
  const [profile, setProfile] = useState<ChefProfile>(() => readStored('christoffel-profile', starterProfile));
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [showDishForm, setShowDishForm] = useState(false);

  const notify = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setFeedback({ message, type });
  }, []);

  useEffect(() => {
    if (!feedback) return;
    const timeout = window.setTimeout(() => setFeedback(null), 4000);
    return () => window.clearTimeout(timeout);
  }, [feedback]);

  useEffect(() => {
    try {
      localStorage.setItem('christoffel-menu', JSON.stringify(items));
    } catch {
      notify('Menu changes are active but could not be saved in this browser.', 'error');
    }
  }, [items, notify]);

  useEffect(() => {
    try {
      localStorage.setItem('christoffel-profile', JSON.stringify(profile));
    } catch {
      notify('Profile changes are active but could not be saved in this browser.', 'error');
    }
  }, [profile, notify]);

  const saveDish = (dish: Omit<MenuItem, 'id'>, id?: string) => {
    if (id) {
      setItems((current) => current.map((item) => item.id === id ? { ...dish, id } : item));
      notify(`${dish.name} updated successfully.`);
    } else {
      setItems((current) => [{ ...dish, id: `dish-${Date.now()}` }, ...current]);
      notify(`${dish.name} added to the menu.`);
    }
    setShowDishForm(false);
    setEditingItem(null);
  };

  const toggleAvailability = (id: string) => {
    const item = items.find((dish) => dish.id === id);
    if (!item) return;
    setItems((current) => current.map((dish) => dish.id === id ? { ...dish, available: !dish.available } : dish));
    notify(`${item.name} ${item.available ? 'paused' : 'made available'}.`);
  };

  const toggleFavorite = (id: string) => {
    const item = items.find((dish) => dish.id === id);
    if (!item) return;
    setItems((current) => current.map((dish) => dish.id === id ? { ...dish, favorite: !dish.favorite } : dish));
    notify(item.favorite ? `${item.name} removed from favorites.` : `${item.name} added to favorites.`);
  };

  const deleteDish = (id: string) => {
    const item = items.find((dish) => dish.id === id);
    if (item && window.confirm(`Delete "${item.name}" from the menu?`)) {
      setItems((current) => current.filter((dish) => dish.id !== id));
      setEditingItem((current) => current?.id === id ? null : current);
      notify(`${item.name} deleted from the menu.`);
    }
  };

  const updateProfile = (nextProfile: ChefProfile) => {
    setProfile(nextProfile);
    notify('Profile saved successfully.');
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
    onDeleteDish: deleteDish,
    onToggleAvailability: toggleAvailability,
    onToggleFavorite: toggleFavorite,
    onUpdateProfile: updateProfile,
    onNavigate: setActiveScreen,
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#home" onClick={(event) => { event.preventDefault(); setActiveScreen('home'); }}>
          <span className="brand-mark">C</span>
          <span><strong>Christoffel</strong><small>KITCHEN</small></span>
        </a>
        <div className="sidebar-label">WORKSPACE</div>
        <nav className="side-nav" aria-label="Main navigation">
          {navigation.map((item) => (
            <button className={activeScreen === item.id ? 'nav-link active' : 'nav-link'} key={item.id} onClick={() => setActiveScreen(item.id)} aria-current={activeScreen === item.id ? 'page' : undefined}>
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
          <div className="mobile-brand"><span className="brand-mark">C</span><strong>Christoffel Kitchen</strong></div>
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
          <button className={activeScreen === item.id ? 'mobile-nav-link active' : 'mobile-nav-link'} key={item.id} onClick={() => setActiveScreen(item.id)} aria-current={activeScreen === item.id ? 'page' : undefined}>
            <span aria-hidden="true">{item.symbol}</span>{item.label}
          </button>
        ))}
      </nav>

      {showDishForm && <DishDialog item={editingItem} onClose={() => setShowDishForm(false)} onSave={saveDish} />}
      {feedback && <div className={`feedback-toast ${feedback.type}`} role={feedback.type === 'error' ? 'alert' : 'status'} aria-live={feedback.type === 'error' ? 'assertive' : 'polite'}>
        <span>{feedback.message}</span>
        <button type="button" onClick={() => setFeedback(null)} aria-label="Dismiss notification">×</button>
      </div>}
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
  const [validationMessage, setValidationMessage] = useState('');

  return (
    <div className="dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <form className="dish-dialog" role="dialog" aria-modal="true" aria-labelledby="dish-dialog-title" onSubmit={(event) => {
        event.preventDefault();
        if (!name.trim()) {
          setValidationMessage('Enter a dish name before saving.');
          return;
        }
        if (!Number.isFinite(Number(price)) || Number(price) <= 0) {
          setValidationMessage('Enter a price greater than R0.00.');
          return;
        }
        setValidationMessage('');
        onSave({ name: name.trim(), category, price: Number(price), description: description.trim(), image: image.trim() || 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85', available, favorite: item?.favorite ?? false }, item?.id);
      }}>
        <div className="dialog-heading"><div><span className="eyebrow">MENU EDITOR</span><h2 id="dish-dialog-title">{item ? 'Update dish' : 'Add a dish'}</h2></div><button type="button" className="close-button" onClick={onClose} aria-label="Close">×</button></div>
        <label className="field-label">Dish name<input autoFocus required maxLength={60} value={name} onChange={(event) => { setName(event.target.value); setValidationMessage(''); }} placeholder="e.g. Roasted pumpkin salad" /></label>
        <div className="field-row">
          <label className="field-label">Category<select value={category} onChange={(event) => setCategory(event.target.value)}><option>Starters</option><option>Mains</option><option>Desserts</option><option>Drinks</option></select></label>
          <label className="field-label">Price (R)<input required type="number" min="0.01" step="0.01" value={price} onChange={(event) => { setPrice(event.target.value); setValidationMessage(''); }} placeholder="0.00" /></label>
        </div>
        <label className="field-label">Description<textarea maxLength={140} rows={3} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="A short description for your guests" /></label>
        <label className="field-label">Photo URL <span className="optional-label">optional</span><input type="url" value={image} onChange={(event) => setImage(event.target.value)} placeholder="https://..." /></label>
        <label className="availability-field"><input type="checkbox" checked={available} onChange={(event) => setAvailable(event.target.checked)} /><span><strong>Available to order</strong><small>Show this dish on the current menu</small></span></label>
        {validationMessage && <p className="form-error" role="alert">{validationMessage}</p>}
        <div className="dialog-actions"><button className="button button-quiet" type="button" onClick={onClose}>Cancel</button><button className="button button-primary" type="submit">{item ? 'Save changes' : 'Add to menu'}</button></div>
      </form>
    </div>
  );
}