import React, { useState, useEffect } from 'react';
import { usePlayerStore } from '../store';
import { apiClient } from '../api';

interface InventoryItem {
  id: string;
  item_id: string;
  name: string;
  type: string;
  rarity: string;
  quantity: number;
}

export default function InventoryPanel() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { coins } = usePlayerStore();

  useEffect(() => {
    const loadInventory = async () => {
      try {
        const res = await apiClient.getInventory();
        setItems(res.data);
      } catch (err) {
        console.error('Failed to load inventory', err);
      } finally {
        setLoading(false);
      }
    };

    loadInventory();
  }, []);

  const filtered = filter === 'all' ? items : items.filter((i) => i.type === filter);

  const rarityColor: Record<string, string> = {
    common: '#9ca3af',
    uncommon: '#22c55e',
    rare: '#3b82f6',
    epic: '#a855f7',
    legendary: '#f59e0b',
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="glass p-6 rounded-xl max-w-2xl w-full max-h-96 flex flex-col">
        <h2 className="text-2xl font-bold text-cyan-400 mb-4">INVENTORY</h2>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
          <div>
            <span className="text-gray-400">Items:</span>
            <span className="ml-2 text-white font-semibold">{items.length}</span>
          </div>
          <div>
            <span className="text-gray-400">Coins:</span>
            <span className="ml-2 text-yellow-400 font-semibold">{coins}</span>
          </div>
          <div>
            <span className="text-gray-400">Weight:</span>
            <span className="ml-2 text-white font-semibold">
              {items.reduce((acc, i) => acc + i.quantity, 0)} / 100
            </span>
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {['all', 'Weapon', 'Armor', 'Potion', 'Material'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 text-xs rounded ${
                filter === f
                  ? 'bg-cyan-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto space-y-2">
          {loading ? (
            <p className="text-gray-400">Loading...</p>
          ) : filtered.length === 0 ? (
            <p className="text-gray-400">No items</p>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className="p-3 bg-gray-900/50 rounded border-l-4"
                style={{ borderColor: rarityColor[item.rarity] || '#9ca3af' }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-white">{item.name}</p>
                    <p className="text-xs text-gray-400">{item.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-cyan-400">×{item.quantity}</p>
                    <p className="text-xs text-gray-400">{item.rarity}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
