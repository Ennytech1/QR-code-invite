import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, QrCode } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="py-24 text-center space-y-6 max-w-lg mx-auto px-4 animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-sm">
        <QrCode size={32} />
      </div>
      <span className="text-6xl font-black text-indigo-600 block">404</span>
      <h1 className="text-3xl font-extrabold text-slate-900">Page Not Found</h1>
      <p className="text-slate-600 text-sm">
        The requested QRInvite route or access gateway could not be located.
      </p>
      <div className="pt-2 flex items-center justify-center gap-4">
        <Link 
          to="/" 
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold text-sm shadow-md shadow-indigo-600/20 flex items-center gap-2 transition-all"
        >
          <Home size={16} />
          <span>Back to Homepage</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
