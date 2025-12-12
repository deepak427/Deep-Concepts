import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Zap, Shirt, Wrench } from 'lucide-react';
import { useLearningStore } from '@/lib/learningState';
import type { InventoryItem } from '@/types/game';

interface InventoryProps {
  isOpen: boolean;
  onClose: () => void;
}

type ItemCategory = 'all' | 'particle' | 'power-up' | 'cosmetic' | 'tool';

const categoryIcons: Record<ItemCategory, React.ReactNode> = {
  all: <Sparkles className="w-4 h-4" />,
  particle: <Sparkles className="w-4 h-4" />,
  'power-up': <Zap className="w-4 h-4" />,
  cosmetic: <Shirt className="w-4 h-4" />,
  tool: <Wrench className="w-4 h-4" />
};

const rarityColors: Record<string, string> = {
  common: 'border-gray-400 bg-gray-50',
  rare: 'border-blue-400 bg-blue-50',
  epic: 'border-purple-400 bg-purple-50',
  legendary: 'border-yellow-400 bg-yellow-50'
};

export function Inventory({ isOpen, onClose }: InventoryProps) {
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory>('all');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  
  const inventory = useLearningStore(state => state.inventory);
  const avatarCosmetics = useLearningStore(state => state.avatarCosmetics);
  const useItem = useLearningStore(state => state.useItem);
  const equipCosmetic = useLearningStore(state => state.equipCosmetic);
  const unequipCosmetic = useLearningStore(state => state.unequipCosmetic);
  const getActiveEffects = useLearningStore(state => state.getActiveEffects);
  
  // Get active effects without causing re-renders
  const activeEffects = getActiveEffects();

  // Filter items by category
  const filteredItems = useMemo(() => {
    if (selectedCategory === 'all') {
      return inventory.items;
    }
    return inventory.items.filter(item => item.type === selectedCategory);
  }, [inventory.items, selectedCategory]);

  // Group items by category
  const groupedItems = useMemo(() => {
    const groups: Record<string, InventoryItem[]> = {
      particle: [],
      'power-up': [],
      cosmetic: [],
      tool: []
    };

    filteredItems.forEach(item => {
      groups[item.type].push(item);
    });

    return groups;
  }, [filteredItems]);

  const handleUseItem = (item: InventoryItem) => {
    if (item.type === 'power-up') {
      const success = useItem(item.id);
      if (success) {
        setSelectedItem(null);
      }
    } else if (item.type === 'cosmetic') {
      const isEquipped = avatarCosmetics.includes(item.id);
      if (isEquipped) {
        unequipCosmetic(item.id);
      } else {
        equipCosmetic(item.id);
      }
    }
  };

  const totalItems = inventory.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />

          {/* Inventory Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Inventory</h2>
                <p className="text-sm text-gray-600">
                  {totalItems} / {inventory.maxSlots} items
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close inventory"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Active Effects */}
            {activeEffects.length > 0 && (
              <div className="p-4 bg-blue-50 border-b">
                <h3 className="text-sm font-semibold text-blue-900 mb-2">Active Effects</h3>
                <div className="flex flex-wrap gap-2">
                  {activeEffects.map((effect, index) => (
                    <div
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium flex items-center gap-1"
                    >
                      <Zap className="w-3 h-3" />
                      {effect.effect.type}
                      {effect.effect.magnitude && ` (${effect.effect.magnitude}x)`}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Category Tabs */}
            <div className="flex gap-2 p-4 border-b overflow-x-auto">
              {(['all', 'particle', 'power-up', 'cosmetic', 'tool'] as ItemCategory[]).map(category => {
                const count = category === 'all' 
                  ? inventory.items.length 
                  : inventory.items.filter(i => i.type === category).length;
                
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                      selectedCategory === category
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {categoryIcons[category]}
                    <span className="capitalize">{category}</span>
                    <span className="text-xs opacity-75">({count})</span>
                  </button>
                );
              })}
            </div>

            {/* Items Grid */}
            <div className="flex-1 overflow-y-auto p-6">
              {selectedCategory === 'all' ? (
                // Show grouped by category
                <div className="space-y-6">
                  {Object.entries(groupedItems).map(([category, items]) => {
                    if (items.length === 0) return null;
                    
                    return (
                      <div key={category}>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3 capitalize flex items-center gap-2">
                          {categoryIcons[category as ItemCategory]}
                          {category}
                        </h3>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                          {items.map(item => (
                            <ItemCard
                              key={item.id}
                              item={item}
                              isSelected={selectedItem?.id === item.id}
                              isEquipped={avatarCosmetics.includes(item.id)}
                              onClick={() => setSelectedItem(item)}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                // Show filtered items
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {filteredItems.map(item => (
                    <ItemCard
                      key={item.id}
                      item={item}
                      isSelected={selectedItem?.id === item.id}
                      isEquipped={avatarCosmetics.includes(item.id)}
                      onClick={() => setSelectedItem(item)}
                    />
                  ))}
                </div>
              )}

              {filteredItems.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No items in this category</p>
                </div>
              )}
            </div>

            {/* Item Details Panel */}
            <AnimatePresence>
              {selectedItem && (
                <motion.div
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '100%' }}
                  className="border-t bg-gray-50 p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-16 h-16 rounded-lg border-2 ${rarityColors[selectedItem.rarity]} flex items-center justify-center text-3xl`}>
                      {selectedItem.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{selectedItem.name}</h3>
                          <p className="text-sm text-gray-600 capitalize">{selectedItem.rarity} {selectedItem.type}</p>
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          x{selectedItem.quantity}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-4">{selectedItem.description}</p>
                      
                      {selectedItem.effect && (
                        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                          <p className="text-xs font-semibold text-blue-900 mb-1">Effect</p>
                          <p className="text-sm text-blue-800">
                            {selectedItem.effect.type}
                            {selectedItem.effect.magnitude && ` (${selectedItem.effect.magnitude}x)`}
                            {selectedItem.effect.duration && ` for ${selectedItem.effect.duration / 1000}s`}
                          </p>
                        </div>
                      )}

                      <div className="flex gap-2">
                        {selectedItem.type === 'power-up' && (
                          <button
                            onClick={() => handleUseItem(selectedItem)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                          >
                            Use Item
                          </button>
                        )}
                        {selectedItem.type === 'cosmetic' && (
                          <button
                            onClick={() => handleUseItem(selectedItem)}
                            className={`px-4 py-2 rounded-lg transition-colors font-medium ${
                              avatarCosmetics.includes(selectedItem.id)
                                ? 'bg-gray-600 text-white hover:bg-gray-700'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                          >
                            {avatarCosmetics.includes(selectedItem.id) ? 'Unequip' : 'Equip'}
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedItem(null)}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

interface ItemCardProps {
  item: InventoryItem;
  isSelected: boolean;
  isEquipped: boolean;
  onClick: () => void;
}

function ItemCard({ item, isSelected, isEquipped, onClick }: ItemCardProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`relative aspect-square rounded-lg border-2 ${rarityColors[item.rarity]} p-2 transition-all ${
        isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''
      }`}
    >
      <div className="w-full h-full flex items-center justify-center text-3xl">
        {item.icon}
      </div>
      
      {/* Quantity Badge */}
      {item.quantity > 1 && (
        <div className="absolute top-1 right-1 bg-gray-900 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {item.quantity}
        </div>
      )}

      {/* Equipped Badge */}
      {isEquipped && (
        <div className="absolute bottom-1 left-1 bg-green-500 text-white text-xs font-bold rounded px-1">
          ✓
        </div>
      )}

      {/* Rarity Indicator */}
      <div className={`absolute bottom-0 left-0 right-0 h-1 rounded-b ${
        item.rarity === 'legendary' ? 'bg-yellow-400' :
        item.rarity === 'epic' ? 'bg-purple-400' :
        item.rarity === 'rare' ? 'bg-blue-400' :
        'bg-gray-400'
      }`} />
    </motion.button>
  );
}
