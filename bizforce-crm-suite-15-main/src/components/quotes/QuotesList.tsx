
import { Quote } from '@/types';
import { QuoteCard } from './QuoteCard';

interface QuotesListProps {
  quotes: Quote[];
  onViewQuote: (quote: Quote) => void;
  onEditQuote: (quote: Quote) => void;
  onSendQuote: (quoteId: string) => void;
  onDownloadQuote: (quote: Quote) => void;
  onDeleteQuote: (quoteId: string) => void;
}

export const QuotesList = ({
  quotes,
  onViewQuote,
  onEditQuote,
  onSendQuote,
  onDownloadQuote,
  onDeleteQuote
}: QuotesListProps) => {
  return (
    <div className="space-y-4">
      {quotes.map((quote) => (
        <QuoteCard
          key={quote.id}
          quote={quote}
          onView={onViewQuote}
          onEdit={onEditQuote}
          onSend={onSendQuote}
          onDownload={onDownloadQuote}
          onDelete={onDeleteQuote}
        />
      ))}
    </div>
  );
};
