import React, { useState } from 'react';
import { X, User, Mail, Lock, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { UserAccount } from '../types';
import { sounds } from '../utils/audio';

interface AuthModalProps {
  onClose: () => void;
  onSuccess: (user: UserAccount) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, onSuccess }) => {
  const [mode, setMode] = useState<'signin' | 'register'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (mode === 'register' && !name)) {
      setError('Please fill in all fields.');
      return;
    }

    sounds.success();
    onSuccess({
      name: mode === 'register' ? name : email.split('@')[0] || 'Vaultly User',
      email,
      balance: 150.0, // Starter bonus credit!
      totalSaved: 38.5,
      memberSince: new Date().toISOString(),
    });
    onClose();
  };

  const handleDemoSignIn = () => {
    sounds.success();
    onSuccess({
      name: 'Alex Mercer',
      email: 'alex.mercer@vaultly.io',
      balance: 250.0, // Generous starter test balance
      totalSaved: 64.2,
      memberSince: '2026-01-15T00:00:00.000Z',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-[#150d26] border border-[#372459] rounded-2xl sm:rounded-3xl p-5 sm:p-8 max-w-md w-full max-h-[95vh] overflow-y-auto relative shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <button
          type="button"
          onClick={() => {
            sounds.click();
            onClose();
          }}
          className="absolute top-4 sm:top-5 right-4 sm:right-5 text-[#8e81aa] hover:text-white p-1 rounded-lg transition-colors"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1 mb-5 sm:mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500 to-pink-500 p-0.5 mx-auto mb-2 shadow-md">
            <div className="w-full h-full bg-[#120a22] rounded-[10px] flex items-center justify-center">
              <span className="font-['Space_Grotesk'] font-bold text-lg text-purple-300">V</span>
            </div>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white font-['Space_Grotesk']">
            {mode === 'signin' ? 'Welcome Back to Vaultly' : 'Create Your Vaultly Account'}
          </h3>
          <p className="text-xs text-[#9c90b8]">
            {mode === 'signin'
              ? 'Access your purchased gift card codes and wallet balance.'
              : 'Sign up to unlock instant discounts and $150 in sandbox credit.'}
          </p>
        </div>

        {/* 1-Click Demo Login button for fast testing */}
        <div className="mb-4">
          <button
            type="button"
            onClick={handleDemoSignIn}
            className="w-full py-2.5 px-3 sm:px-4 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 hover:from-emerald-500/30 hover:to-cyan-500/30 border border-emerald-500/40 rounded-xl text-[11px] sm:text-xs font-bold text-emerald-300 transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <Sparkles size={14} className="text-emerald-400 shrink-0" />
            <span className="truncate">1-Click Demo Sign In ($250 Test Balance)</span>
          </button>
        </div>

        <div className="flex items-center gap-2 my-4">
          <div className="h-[1px] bg-[#271b3e] flex-1" />
          <span className="text-[10px] uppercase font-mono text-[#796d94]">Or with email</span>
          <div className="h-[1px] bg-[#271b3e] flex-1" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-medium text-white mb-1">Full Name</label>
              <div className="relative">
                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7f719b]" />
                <input
                  type="text"
                  placeholder="e.g. Elena Vance"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-[#100820] border border-[#2d1c47] rounded-xl text-xs text-white placeholder-[#655681] focus:outline-none focus:border-[#a78bfa]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-white mb-1">Email Address</label>
            <div className="relative">
              <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7f719b]" />
              <input
                type="email"
                placeholder="name@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-[#100820] border border-[#2d1c47] rounded-xl text-xs text-white placeholder-[#655681] focus:outline-none focus:border-[#a78bfa]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-white mb-1">Password</label>
            <div className="relative">
              <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7f719b]" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-[#100820] border border-[#2d1c47] rounded-xl text-xs text-white placeholder-[#655681] focus:outline-none focus:border-[#a78bfa]"
              />
            </div>
          </div>

          {error && <p className="text-xs text-rose-400">{error}</p>}

          <button
            type="submit"
            className="w-full py-3 bg-[#a78bfa] hover:bg-[#c4b5fd] text-[#120726] rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer mt-2"
          >
            {mode === 'signin' ? 'Sign In to Vaultly' : 'Create Free Account'}
          </button>
        </form>

        <div className="mt-5 text-center text-xs text-[#9c90b8]">
          {mode === 'signin' ? (
            <p>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  sounds.click();
                  setMode('register');
                  setError('');
                }}
                className="text-[#c4b5fd] font-semibold hover:underline"
              >
                Sign up
              </button>
            </p>
          ) : (
            <p>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => {
                  sounds.click();
                  setMode('signin');
                  setError('');
                }}
                className="text-[#c4b5fd] font-semibold hover:underline"
              >
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
