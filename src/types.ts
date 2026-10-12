export type MenuItem = {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  available: boolean;
  favorite: boolean;
};

export type ChefProfile = {
  name: string;
  restaurant: string;
  email: string;
  location: string;
};

export type ScreenProps = {
  items: MenuItem[];
  profile: ChefProfile;
  onAddDish: () => void;
  onEditDish: (item: MenuItem) => void;
  onToggleAvailability: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onUpdateProfile: (profile: ChefProfile) => void;
  onNavigate: (screen: 'home' | 'menu' | 'favorites' | 'profile') => void;
};