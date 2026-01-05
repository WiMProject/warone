
import React from 'react';
import { MenuItem, InventoryItem } from './types';

export const SAMPLE_MENU: MenuItem[] = [
  { id: '1', name: 'Nasi Rames', price: 15000, category: 'Main', image: 'https://picsum.photos/seed/nasi/400/300', description: 'Nasi dengan pilihan 3 sayur dan sambal.', stock: 50 },
  { id: '2', name: 'Ayam Goreng Lengkuas', price: 12000, category: 'Protein', image: 'https://picsum.photos/seed/ayam/400/300', description: 'Ayam goreng rempah khas nusantara.', stock: 20 },
  { id: '3', name: 'Telur Balado', price: 5000, category: 'Protein', image: 'https://picsum.photos/seed/telur/400/300', description: 'Telur rebus bumbu pedas manis.', stock: 30 },
  { id: '4', name: 'Tempe Orek', price: 3000, category: 'Side', image: 'https://picsum.photos/seed/tempe/400/300', description: 'Tempe potong kecil bumbu kecap.', stock: 100 },
  { id: '5', name: 'Es Teh Manis', price: 5000, category: 'Drink', image: 'https://picsum.photos/seed/esteh/400/300', description: 'Segarnya es teh manis.', stock: 200 },
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  { id: 'i1', name: 'Beras', quantity: 25, unit: 'kg', minStock: 10 },
  { id: 'i2', name: 'Ayam Potong', quantity: 50, unit: 'pcs', minStock: 15 },
  { id: 'i3', name: 'Telur Ayam', quantity: 100, unit: 'butir', minStock: 30 },
  { id: 'i4', name: 'Minyak Goreng', quantity: 10, unit: 'liter', minStock: 5 },
];

export const Icons = {
  Home: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
  Cart: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
  History: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  User: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  Admin: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
  Kitchen: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>,
};
