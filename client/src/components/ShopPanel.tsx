import React, { useState, useEffect } from 'react';
import { usePlayerStore } from '../store';
import { apiClient } from '../api';

interface ShopItem {
  id: string;
  price: number;
}

export default function ShopPanel() {
  const [items, setItems] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { coins, setPlayerData } = usePlayerStore();

  useEffect(() => {
    const loadShop = async () => {
      try {
        const res = await apiClient.getShopItems();
        setItems(res.data);
      } catch (err) {
        console.error('Failed to load shop', err);
      } finally {
        setLoading(false);
      }
    };

    loadShop();
  }, []);

  const handleBuy = async () => {
    if (!selectedItem) return;

    try {
      const res = await apiClient.buyItem(selectedItem.id, quantity);
      setPlayerData({ coins: res.data.newCoins });
      setSelectedItem(null);
      setQuantity(1);
      alert(`Purchased ${selectedItem.id} ×${quantity}`);
    } catch (err: any) {
      alert(err.response?.data?.error || 'Purchase failed');
    }
  };

  const totalCost = selectedItem ? selectedItem.price * quantity : 0;
  const canAfford = coins >= totalCost;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="glass p-6 rounded-xl max-w-2xl w-full max-h-96 flex flex-col">
        <h2 className="text-2xl font-bold text-cyan-400 mb-4">SHOP</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 overflow-hidden">
          {/* Items List */}
          <div className="overflow-y-auto space-y-2">
            {loading ? (
              <p className="text-gray-400">Loading...</p>
            ) : (
              items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`w-full p-3 rounded text-left transition ${
                    selectedItem?.id === item.id
                      ? 'bg-cyan-600/50 border border-cyan-400'
                      : 'bg-gray-800 border border-gray-700 hover:bg-gray-750'
                  }`}
                >
                  <p className="font-semibold text-white">{item.id}</p>
                  <p className="text-sm text-yellow-400">{item.price} coins</p>
                </button>
              ))
            )}
          </div>

          {/* Buy Panel */}
          {selectedItem && (
            <div className="flex flex-col justify-between">
              <div className="space-y-4">
                <div>
                  <p className="text-gray-400 text-sm">Item</p>
                  <p className="text-xl font-bold text-white">{selectedItem.id}</p>
                </div>

                <div>
                  <p className="text-gray-400 text-sm">Price per unit</p>
                  <p className="text-lg text-yellow-400 font-semibold">{selectedItem.price}</p>
                </div>

                <div>
                  <p className="text-gray-400 text-sm mb-2">Quantity</p>
                  <input
                    type="number"
                    min={1}
                    max={Math.floor(coins / selectedItem.price)}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3 py-2 bg-gray-900 border border-cyan-500/50 rounded text-white"
                  />
                </div>

                <div className="pt-4 border-t border-cyan-500/30">
                  <p className="text-gray-400 text-sm">Total Cost</p>
                  <p className={`text-2xl font-bold ${canAfford ? 'text-green-400' : 'text-red-400'}`}>
                    {totalCost}
                  </p>
                  <p className="text-xs text-gray-400">You have: {coins}</p>
                </div>
              </div>

              <button
                onClick={handleBuy}
                disabled={!canAfford}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed mt-4"
              >
                BUY NOW
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
