'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, Settings, CheckCircle, XCircle } from 'lucide-react';

interface ConsentBannerProps {
  onAccept: () => void;
  onReject: () => void;
  onManage: () => void;
  onClose: () => void;
}

export function ConsentBanner({ onAccept, onReject, onManage, onClose }: ConsentBannerProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('gdpr-consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('gdpr-consent', 'accepted');
    setIsVisible(false);
    onAccept();
  };

  const handleReject = () => {
    localStorage.setItem('gdpr-consent', 'rejected');
    setIsVisible(false);
    onReject();
  };

  const handleManage = () => {
    onManage();
  };

  const handleClose = () => {
    setIsVisible(false);
    onClose();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2">We value your privacy</h3>
            <p className="text-sm text-muted-foreground">
              We use cookies and similar technologies to provide, protect, and improve our services. 
              You can choose to accept all cookies, reject non-essential cookies, or manage your preferences.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              onClick={handleAccept}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Accept All
            </Button>
            
            <Button
              onClick={handleReject}
              variant="outline"
              className="border-red-300 text-red-600 hover:bg-red-50"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Reject
            </Button>
            
            <Button
              onClick={handleManage}
              variant="outline"
            >
              <Settings className="w-4 h-4 mr-2" />
              Manage
            </Button>
            
            <Button
              onClick={handleClose}
              variant="ghost"
              size="sm"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Consent Management Modal
export function ConsentModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Cookie Preferences</h2>
            <Button onClick={onClose} variant="ghost" size="sm">
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Essential Cookies</h3>
              <p className="text-sm text-muted-foreground mb-2">
                These cookies are necessary for the website to function and cannot be switched off.
              </p>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="always-active" name="always-active" checked disabled className="rounded" />
                <span className="text-sm">Always Active</span>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Analytics Cookies</h3>
              <p className="text-sm text-muted-foreground mb-2">
                These cookies help us understand how visitors interact with our website.
              </p>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="google-analytics" name="google-analytics" defaultChecked className="rounded" />
                <span className="text-sm">Google Analytics</span>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Advertising Cookies</h3>
              <p className="text-sm text-muted-foreground mb-2">
                These cookies are used to make advertising messages more relevant to you.
              </p>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="google-adsense" name="google-adsense" defaultChecked className="rounded" />
                <span className="text-sm">Google AdSense</span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 mt-6">
            <Button onClick={onClose} variant="outline">
              Cancel
            </Button>
            <Button onClick={onClose}>
              Save Preferences
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
