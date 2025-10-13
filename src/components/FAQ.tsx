'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  items: FAQItem[];
  title?: string;
}

export function FAQ({ items, title = "Frequently Asked Questions" }: FAQProps) {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <section className="mt-16 px-4">
      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-8 text-center">
        {title}
      </h2>
      <div className="max-w-3xl mx-auto space-y-3">
        {items.map((item, index) => (
          <div key={index} className="border rounded-lg overflow-hidden">
            <button
              className="w-full flex items-start justify-between p-3 sm:p-4 text-left hover:bg-muted/50 transition-colors"
              onClick={() => toggleItem(index)}
            >
              <span className="font-semibold text-sm sm:text-base pr-3 flex-1 leading-tight">
                {item.question}
              </span>
              <div className="flex-shrink-0 mt-0.5">
                {openItems.includes(index) ? (
                  <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5" />
                ) : (
                  <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5" />
                )}
              </div>
            </button>
            {openItems.includes(index) && (
              <div className="px-3 sm:px-4 pb-3 sm:pb-4 border-t bg-muted/20">
                <p className="text-muted-foreground leading-relaxed text-xs sm:text-sm pt-3">
                  {item.answer}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
