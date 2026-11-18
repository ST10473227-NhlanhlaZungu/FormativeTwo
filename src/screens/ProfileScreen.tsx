import { useEffect, useState } from 'react';
import type { ChefProfile, ScreenProps } from '../types';

export default function ProfileScreen({ items, profile, onAddDish, onEditDish, onDeleteDish, onUpdateProfile }: ScreenProps) {
  const [draft, setDraft] = useState(profile);
  const [validationMessage, setValidationMessage] = useState('');
  useEffect(() => setDraft(profile), [profile]);
  const updateField = (field: keyof ChefProfile, value: string) => {
    setDraft((current) => ({ ...current, [field]: value }));
    setValidationMessage('');
  };
  const initials = draft.name.split(' ').map((part) => part[0]).slice(0, 2).join('');
  const availableCount = items.filter((item) => item.available).length;
  const favoriteCount = items.filter((item) => item.favorite).length;

  return (
    <>
      <header className="page-heading"><div><span className="eyebrow">YOUR KITCHEN DETAILS</span><h1>Profile</h1><p>Keep chef and restaurant details current.</p></div></header>
      <div className="profile-grid">
        <aside className="profile-panel">
          <div className="profile-person"><div className="profile-avatar">{initials || 'C'}</div><div><h2>{draft.name || 'Chef name'}</h2><p>Head chef · {draft.restaurant || 'Restaurant name'}</p></div></div>
          <div className="profile-metric"><span>Menu items</span><strong>{items.length}</strong></div>
          <div className="profile-metric"><span>Available</span><strong>{availableCount}</strong></div>
          <div className="profile-metric"><span>Favorites</span><strong>{favoriteCount}</strong></div>
        </aside>
        <section className="profile-form-panel">
          <div className="panel-title-row"><h2>Chef & restaurant</h2></div>
          <form onSubmit={(event) => {
            event.preventDefault();
            if (![draft.name, draft.restaurant, draft.email, draft.location].every((value) => value.trim())) {
              setValidationMessage('Complete all profile fields before saving.');
              return;
            }
            setValidationMessage('');
            onUpdateProfile({
              name: draft.name.trim(),
              restaurant: draft.restaurant.trim(),
              email: draft.email.trim(),
              location: draft.location.trim(),
            });
          }}>
            <div className="form-grid">
              <label className="field-label">Chef name<input required maxLength={80} value={draft.name} onChange={(event) => updateField('name', event.target.value)} /></label>
              <label className="field-label">Restaurant name<input required maxLength={100} value={draft.restaurant} onChange={(event) => updateField('restaurant', event.target.value)} /></label>
              <label className="field-label">Email address<input required type="email" value={draft.email} onChange={(event) => updateField('email', event.target.value)} /></label>
              <label className="field-label">Location<input required maxLength={100} value={draft.location} onChange={(event) => updateField('location', event.target.value)} /></label>
            </div>
            {validationMessage && <p className="form-error" role="alert">{validationMessage}</p>}
            <div className="profile-save-row"><button className="button button-primary" type="submit">Save profile</button></div>
          </form>
          <h2 className="profile-menu-heading">Manage menu</h2>
          <div className="panel-title-row"><span>{items.length} dishes</span><button className="button button-primary" onClick={onAddDish}>+ Add dish</button></div>
          {items.length ? <div className="managed-menu">{items.map((item) => (
            <div className="managed-menu-row" key={item.id}>
              <div className="dish-thumb" style={{ backgroundImage: `url("${item.image}")` }} />
              <div className="managed-menu-row-copy"><strong>{item.name}</strong><small>{item.category} · R{item.price.toFixed(2)}</small></div>
              <span className={`availability-chip ${item.available ? 'on' : 'off'}`}>{item.available ? 'Available' : 'Paused'}</span>
              <button className="dish-row-action" onClick={() => onEditDish(item)}>Edit</button>
              <button className="dish-row-action delete-action" onClick={() => onDeleteDish(item.id)}>Delete</button>
            </div>
          ))}</div> : <div className="empty-state"><strong>Your menu is empty</strong>Add your first dish to start building the menu.</div>}
        </section>
      </div>
    </>
  );
}
