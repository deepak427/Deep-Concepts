import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, Map, Trophy, Settings, HelpCircle } from 'lucide-react';
import { PixelButton } from './PixelButton';
import { cn } from '../../lib/utils';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  badge?: number;
}

interface ResponsiveNavProps {
  currentView: string;
  onNavigate: (view: string) => void;
  userLevel: number;
  xp: number;
  className?: string;
}

export function ResponsiveNav({ 
  currentView, 
  onNavigate, 
  userLevel, 
  xp, 
  className 
}: ResponsiveNavProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems: NavItem[] = [
    {
      id: 'hub',
      label: 'Quantum Hub',
      icon: <Home className="w-4 h-4" />,
      onClick: () => onNavigate('hub'),
    },
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <Map className="w-4 h-4" />,
      onClick: () => onNavigate('dashboard'),
    },
    {
      id: 'achievements',
      label: 'Achievements',
      icon: <Trophy className="w-4 h-4" />,
      onClick: () => onNavigate('achievements'),
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-4 h-4" />,
      onClick: () => onNavigate('settings'),
    },
    {
      id: 'help',
      label: 'Help',
      icon: <HelpCircle className="w-4 h-4" />,
      onClick: () => onNavigate('help'),
    },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className={cn(
        "hidden md:flex fixed top-0 left-0 right-0 z-50 bg-void-900/95 backdrop-blur-sm border-b-2 border-void-700",
        className
      )}>
        <div className="container flex items-center justify-between py-4">
          {/* Logo/Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-quantum-500 border-2 border-quantum-400 flex items-center justify-center">
              <span className="text-void-950 font-display text-xs">Q</span>
            </div>
            <span className="font-display text-quantum-400 text-lg tracking-widest">
              QUANTUM_REALM
            </span>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center gap-2">
            {navItems.map((item) => (
              <PixelButton
                key={item.id}
                variant={currentView === item.id ? 'primary' : 'ghost'}
                size="sm"
                onClick={item.onClick}
                className="flex items-center gap-2"
              >
                {item.icon}
                <span className="hidden lg:inline">{item.label}</span>
                {item.badge && (
                  <span className="bg-energy-500 text-void-950 text-xs px-1 rounded-full min-w-[16px] h-4 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </PixelButton>
            ))}
          </div>

          {/* User Stats */}
          <div className="flex items-center gap-4">
            <div className="bg-void-800 border-2 border-void-600 px-3 py-1 flex items-center gap-2">
              <span className="text-energy-400 font-display text-sm">LVL</span>
              <span className="text-white font-display">{userLevel}</span>
            </div>
            <div className="bg-void-800 border-2 border-void-600 px-3 py-1 flex items-center gap-2">
              <span className="text-quantum-400 font-display text-sm">XP</span>
              <span className="text-white font-display">{xp.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        {/* Mobile Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-void-900/95 backdrop-blur-sm border-b-2 border-void-700">
          <div className="flex items-center justify-between p-4">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-quantum-500 border-2 border-quantum-400 flex items-center justify-center">
                <span className="text-void-950 font-display text-xs">Q</span>
              </div>
              <span className="font-display text-quantum-400 text-sm tracking-widest">
                QUANTUM
              </span>
            </div>

            {/* User Stats - Mobile */}
            <div className="flex items-center gap-2">
              <div className="bg-void-800 border border-void-600 px-2 py-1 text-xs">
                <span className="text-energy-400 font-display">L{userLevel}</span>
              </div>
              <div className="bg-void-800 border border-void-600 px-2 py-1 text-xs">
                <span className="text-quantum-400 font-display">{Math.floor(xp/1000)}K</span>
              </div>
            </div>

            {/* Menu Button */}
            <PixelButton
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </PixelButton>
          </div>
        </header>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
                onClick={toggleMobileMenu}
              />

              {/* Menu Panel */}
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'tween', duration: 0.3 }}
                className="fixed top-0 right-0 bottom-0 z-50 w-80 max-w-[80vw] bg-void-900 border-l-4 border-quantum-500 shadow-xl"
              >
                <div className="p-6 pt-20">
                  <nav className="space-y-2">
                    {navItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          item.onClick();
                          setIsMobileMenuOpen(false);
                        }}
                        className={cn(
                          "w-full flex items-center gap-3 p-4 text-left transition-all duration-200",
                          "border-2 font-display tracking-wider uppercase text-sm",
                          currentView === item.id
                            ? "bg-quantum-500 border-quantum-400 text-void-950"
                            : "bg-void-800 border-void-600 text-slate-300 hover:border-quantum-500 hover:text-quantum-400"
                        )}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                        {item.badge && (
                          <span className="ml-auto bg-energy-500 text-void-950 text-xs px-2 py-1 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    ))}
                  </nav>

                  {/* Mobile User Info */}
                  <div className="mt-8 p-4 bg-void-950 border-2 border-void-700">
                    <h3 className="font-display text-quantum-400 text-sm mb-3 tracking-widest">
                      PLAYER_STATS
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 text-sm">Level</span>
                        <span className="text-energy-400 font-display">{userLevel}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 text-sm">Experience</span>
                        <span className="text-quantum-400 font-display">{xp.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Navigation for Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-void-900/95 backdrop-blur-sm border-t-2 border-void-700">
        <div className="grid grid-cols-5 gap-1 p-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={item.onClick}
              className={cn(
                "flex flex-col items-center gap-1 p-2 rounded transition-colors",
                "min-h-[60px] relative",
                currentView === item.id
                  ? "text-quantum-400 bg-quantum-500/10"
                  : "text-slate-400 hover:text-quantum-400"
              )}
            >
              {item.icon}
              <span className="text-xs font-display tracking-wider">
                {item.label.split(' ')[0]}
              </span>
              {item.badge && (
                <span className="absolute -top-1 -right-1 bg-energy-500 text-void-950 text-xs px-1 rounded-full min-w-[16px] h-4 flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}