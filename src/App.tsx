import React, { useState, useEffect } from 'react';
import { Brand, PurchasedCard, Transaction, UserAccount } from './types';
import { BRANDS } from './data/brands';
import { ParticleField } from './components/ParticleField';
import { Navbar } from './components/Navbar';
import { Marketplace } from './components/Marketplace';
import { CardDetailView } from './components/CardDetailView';
import { MyVault } from './components/MyVault';
import { SellCardView } from './components/SellCardView';
import { SavingsCalculator } from './components/SavingsCalculator';
import { HistoryView } from './components/HistoryView';
import { AddFundsModal } from './components/AddFundsModal';
import { AuthModal } from './components/AuthModal';
import { PurchaseSuccessModal } from './components/PurchaseSuccessModal';
import { sounds } from './utils/audio';

// Pre-seeded starter cards so "My Vault" is immediately interactive
const INITIAL_CARDS: PurchasedCard[] = [
  {
    id: 'vc-101',
    brandId: 'fennel',
    brandName: 'Fennel Organic Market',
    initial: 'F',
    color: '#3F7D58',
    secondaryColor: '#245136',
    category: 'Grocery',
    faceValue: 50.0,
    currentBalance: 32.5,
    purchasePrice: 47.75,
    code: 'FEN-8924-1049',
    pin: '8492',
    purchasedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    isGift: false,
    redeemed: false,
    barcodeNumber: '892410493821',
  },
  {
    id: 'vc-102',
    brandId: 'northlane',
    brandName: 'Northlane Outfitter',
    initial: 'N',
    color: '#D97736',
    secondaryColor: '#8C4616',
    category: 'Outdoor & apparel',
    faceValue: 100.0,
    currentBalance: 100.0,
    purchasePrice: 92.0,
    code: 'NOR-7712-9931',
    pin: '3109',
    purchasedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    isGift: true,
    recipientName: 'Jordan Reed',
    recipientEmail: 'jordan.reed@example.com',
    giftMessage: 'Gear up for the Tahoe backpacking trail! Best wishes.',
    giftTheme: 'emerald',
    redeemed: false,
    barcodeNumber: '771299310492',
  },
];

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-001',
    type: 'purchase',
    title: 'Purchased Fennel Organic Market Card',
    brandName: 'Fennel Organic Market',
    amount: -47.75,
    faceValue: 50.0,
    discountAmount: 2.25,
    code: 'FEN-8924-1049',
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'tx-002',
    type: 'purchase',
    title: 'Gift: Northlane Outfitter Card for Jordan',
    brandName: 'Northlane Outfitter',
    amount: -92.0,
    faceValue: 100.0,
    discountAmount: 8.0,
    code: 'NOR-7712-9931',
    timestamp: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 'tx-003',
    type: 'deposit',
    title: 'Vaultly Welcome Bonus Deposit',
    amount: 250.0,
    timestamp: new Date(Date.now() - 86400000 * 7).toISOString(),
  },
];

export default function App() {
  // Primary navigation state
  const [currentTab, setCurrentTab] = useState<'marketplace' | 'vault' | 'sell' | 'calculator' | 'history' | 'detail'>('marketplace');
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);

  // Modals state
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAddFundsModal, setShowAddFundsModal] = useState(false);
  const [successModalCard, setSuccessModalCard] = useState<PurchasedCard | null>(null);

  // Persistent User state
  const [user, setUser] = useState<UserAccount | null>(() => {
    const saved = localStorage.getItem('vaultly_user');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    // Default demo authenticated user for frictionless first-time experience
    return {
      name: 'Alex Mercer',
      email: 'alex.mercer@vaultly.io',
      balance: 185.25,
      totalSaved: 48.50,
      memberSince: '2026-01-15T00:00:00.000Z',
    };
  });

  // Persistent Cards state
  const [cards, setCards] = useState<PurchasedCard[]>(() => {
    const saved = localStorage.getItem('vaultly_cards');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return INITIAL_CARDS;
  });

  // Persistent Transactions state
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('vaultly_tx');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return INITIAL_TRANSACTIONS;
  });

  // Save changes to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('vaultly_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('vaultly_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('vaultly_cards', JSON.stringify(cards));
  }, [cards]);

  useEffect(() => {
    localStorage.setItem('vaultly_tx', JSON.stringify(transactions));
  }, [transactions]);

  // Handle Card Selection
  const handleSelectBrand = (brand: Brand) => {
    setSelectedBrand(brand);
    setCurrentTab('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle Card Purchase
  const handlePurchase = (details: {
    brand: Brand;
    denomination: number;
    quantity: number;
    totalPayable: number;
    isGift: boolean;
    recipientName?: string;
    recipientEmail?: string;
    giftMessage?: string;
    giftTheme?: string;
  }) => {
    if (!user) return;

    sounds.success();

    const newCards: PurchasedCard[] = [];
    const discountAmount = (details.denomination * details.quantity) - details.totalPayable;

    for (let i = 0; i < details.quantity; i++) {
      const codeSuffix1 = Math.random().toString(36).slice(2, 6).toUpperCase();
      const codeSuffix2 = Math.random().toString(36).slice(2, 6).toUpperCase();
      const randomPin = Math.floor(1000 + Math.random() * 9000).toString();
      const cardCode = `${details.brand.id.slice(0, 3).toUpperCase()}-${codeSuffix1}-${codeSuffix2}`;

      const card: PurchasedCard = {
        id: `card-${Date.now()}-${i}`,
        brandId: details.brand.id,
        brandName: details.brand.name,
        initial: details.brand.initial,
        color: details.brand.color,
        secondaryColor: details.brand.secondaryColor,
        category: details.brand.category,
        faceValue: details.denomination,
        currentBalance: details.denomination,
        purchasePrice: details.totalPayable / details.quantity,
        code: cardCode,
        pin: randomPin,
        purchasedAt: new Date().toISOString(),
        isGift: details.isGift,
        recipientName: details.recipientName,
        recipientEmail: details.recipientEmail,
        giftMessage: details.giftMessage,
        giftTheme: details.giftTheme,
        redeemed: false,
        barcodeNumber: Math.floor(100000000000 + Math.random() * 900000000000).toString(),
      };
      newCards.push(card);
    }

    // Update state
    setCards(prev => [...newCards, ...prev]);

    // Record Transaction
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      type: 'purchase',
      title: details.isGift
        ? `Gift: ${details.brand.name} for ${details.recipientName}`
        : `Purchased ${details.brand.name} Card (${details.quantity}x)`,
      brandName: details.brand.name,
      amount: -details.totalPayable,
      faceValue: details.denomination * details.quantity,
      discountAmount,
      code: newCards[0].code,
      timestamp: new Date().toISOString(),
    };
    setTransactions(prev => [newTx, ...prev]);

    // Deduct user balance and update totalSaved
    setUser(u => u ? ({
      ...u,
      balance: Math.max(0, u.balance - details.totalPayable),
      totalSaved: u.totalSaved + discountAmount,
    }) : null);

    // Show celebratory modal for the first card
    setSuccessModalCard(newCards[0]);
  };

  // Update card balance (spent partially)
  const handleUpdateCardBalance = (cardId: string, newBalance: number) => {
    setCards(prev => prev.map(c => c.id === cardId ? { ...c, currentBalance: newBalance } : c));
  };

  // Toggle card marked as redeemed
  const handleToggleRedeemed = (cardId: string) => {
    setCards(prev => prev.map(c => c.id === cardId ? { ...c, redeemed: !c.redeemed } : c));
  };

  // Add Funds to Balance
  const handleAddFunds = (amount: number) => {
    setUser(u => u ? ({
      ...u,
      balance: u.balance + amount,
    }) : null);

    const tx: Transaction = {
      id: `tx-${Date.now()}`,
      type: 'deposit',
      title: 'Vaultly Balance Deposit',
      amount: amount,
      timestamp: new Date().toISOString(),
    };
    setTransactions(prev => [tx, ...prev]);
  };

  // Sell Card Liquidation
  const handleSellComplete = (payoutAmount: number, brandName: string, faceValue: number) => {
    setUser(u => u ? ({
      ...u,
      balance: u.balance + payoutAmount,
    }) : null);

    const tx: Transaction = {
      id: `tx-${Date.now()}`,
      type: 'sell',
      title: `Cashed Out ${brandName} Card`,
      brandName,
      amount: payoutAmount,
      faceValue,
      timestamp: new Date().toISOString(),
    };
    setTransactions(prev => [tx, ...prev]);
  };

  const activeCardsCount = cards.filter(c => !c.redeemed).length;

  return (
    <div className="min-h-screen bg-[#0b0813] text-[#f1ecfa] relative selection:bg-[#a78bfa] selection:text-[#0b0813]">
      {/* Dynamic Cursor Reactive Starfield Canvas */}
      <ParticleField />

      {/* Main Top Navigation */}
      <Navbar
        currentTab={currentTab}
        setTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        user={user}
        onOpenAuth={() => setShowAuthModal(true)}
        onOpenAddFunds={() => setShowAddFundsModal(true)}
        onLogout={() => {
          sounds.click();
          setUser(null);
        }}
        activeCardsCount={activeCardsCount}
      />

      {/* Main Content Areas */}
      <main className="relative z-10 pb-24 sm:pb-20">
        {currentTab === 'marketplace' && (
          <Marketplace
            onSelectBrand={handleSelectBrand}
            onOpenSell={() => setCurrentTab('sell')}
            onOpenCalculator={() => setCurrentTab('calculator')}
          />
        )}

        {currentTab === 'detail' && selectedBrand && (
          <CardDetailView
            brand={selectedBrand}
            user={user}
            onBack={() => setCurrentTab('marketplace')}
            onPurchase={handlePurchase}
            onOpenAddFunds={() => setShowAddFundsModal(true)}
            onOpenAuth={() => setShowAuthModal(true)}
          />
        )}

        {currentTab === 'vault' && (
          <MyVault
            cards={cards}
            onUpdateCardBalance={handleUpdateCardBalance}
            onToggleRedeemed={handleToggleRedeemed}
            onExploreMarketplace={() => setCurrentTab('marketplace')}
          />
        )}

        {currentTab === 'sell' && (
          <SellCardView
            user={user}
            onOpenAuth={() => setShowAuthModal(true)}
            onSellComplete={handleSellComplete}
            onBack={() => setCurrentTab('marketplace')}
          />
        )}

        {currentTab === 'calculator' && (
          <SavingsCalculator
            onBrowseCategory={() => setCurrentTab('marketplace')}
          />
        )}

        {currentTab === 'history' && (
          <HistoryView
            transactions={transactions}
            onBack={() => setCurrentTab('marketplace')}
          />
        )}
      </main>

      {/* Modals */}
      {showAddFundsModal && user && (
        <AddFundsModal
          onClose={() => setShowAddFundsModal(false)}
          onAdd={handleAddFunds}
          currentBalance={user.balance}
        />
      )}

      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onSuccess={(account) => setUser(account)}
        />
      )}

      {successModalCard && (
        <PurchaseSuccessModal
          card={successModalCard}
          onGoToVault={() => {
            setSuccessModalCard(null);
            setCurrentTab('vault');
          }}
          onClose={() => setSuccessModalCard(null)}
        />
      )}
    </div>
  );
}
