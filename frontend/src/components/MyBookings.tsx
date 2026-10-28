import { useCallback, useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { cancelBooking, deleteCancelledBooking, getMyBookings } from '../utils/api';
import type { Booking } from '../types/booking';
import { useLanguage } from '../context/LanguageContext';

type MyBookingsProps = {
  onClose?: () => void;
};

export function MyBookings({ onClose }: MyBookingsProps) {
  const { language, t } = useLanguage();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [statusFilter, setStatusFilter] = useState<'All' | Booking['status']>('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancellingBookingId, setCancellingBookingId] = useState<string | null>(null);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [deletingBookingId, setDeletingBookingId] = useState<string | null>(null);

  const loadBookings = useCallback(() => {
    setLoading(true);
    setError(null);
    getMyBookings()
      .then(setBookings)
      .catch((requestError) => {
        setError(
          requestError instanceof Error
            ? requestError.message
            : t('Rezervările nu au putut fi încărcate.'),
        );
      })
      .finally(() => setLoading(false));
  }, [t]);

  const handleCancelBooking = async (booking: Booking) => {
    if (booking.status === 'Cancelled') return;
    if (!window.confirm(`${t('Anulezi rezervarea pentru')} ${booking.fieldName}?`)) return;

    setCancellingBookingId(booking.id);
    setCancelError(null);

    try {
      const result = await cancelBooking(booking.id);
      setBookings((currentBookings) =>
        currentBookings.map((currentBooking) =>
          currentBooking.id === booking.id
            ? {
                ...currentBooking,
                status: 'Cancelled',
                cancelledAt: result.cancelledAt,
              }
            : currentBooking,
        ),
      );
    } catch (requestError) {
      setCancelError(
        requestError instanceof Error
          ? requestError.message
          : t('Rezervarea nu a putut fi anulată.'),
      );
    } finally {
      setCancellingBookingId(null);
    }
  };

  const handleDeleteBooking = async (booking: Booking) => {
    if (booking.status !== 'Cancelled') return;
    if (!window.confirm(`${t('Ștergi definitiv rezervarea pentru')} ${booking.fieldName}?`)) return;

    setDeletingBookingId(booking.id);
    setCancelError(null);
    try {
      await deleteCancelledBooking(booking.id);
      setBookings((currentBookings) =>
        currentBookings.filter((currentBooking) => currentBooking.id !== booking.id),
      );
    } catch (requestError) {
      setCancelError(
        requestError instanceof Error
          ? requestError.message
          : t('Rezervarea nu a putut fi ștearsă.'),
      );
    } finally {
      setDeletingBookingId(null);
    }
  };

  useEffect(() => {
    // Loading data on mount synchronizes the component with the protected API.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadBookings();
  }, [loadBookings]);

  const visibleBookings = statusFilter === 'All'
    ? bookings
    : bookings.filter((booking) => booking.status === statusFilter);

  const statusLabel = (status: Booking['status']) => {
    if (status === 'Confirmed') return t('Confirmată');
    if (status === 'Cancelled') return t('Anulată');
    if (status === 'Expired') return t('Expirată');
    return t('În așteptare');
  };

  const statusClass = (status: Booking['status']) => {
    if (status === 'Confirmed') return 'bg-emerald-500/10 text-emerald-400';
    if (status === 'Cancelled') return 'bg-red-500/10 text-red-400';
    if (status === 'Expired') return 'bg-slate-500/20 text-slate-400';
    return 'bg-amber-500/10 text-amber-400';
  };

  return (
    <section id="rezervarile-mele" className="mx-auto max-w-7xl scroll-mt-24 px-6 py-10">
      <div className="rounded-3xl border border-white/5 bg-surface-container/60 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.2)] md:p-7">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-on-surface">{t('Rezervările mele')}</h2>
          <p className="mt-1 text-sm text-on-surface-variant">
            {bookings.length} {bookings.length === 1 ? t('rezervare') : t('rezervări')} {t('în total')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadBookings}
            disabled={loading}
            aria-label={t('Reîncarcă rezervările')}
            className="rounded-xl bg-surface-container-high p-2.5 text-on-surface-variant hover:bg-surface-container-highest disabled:cursor-wait disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-surface-container-high px-4 py-2 text-sm font-semibold text-on-surface hover:bg-surface-container-highest"
            >
              {t('Închide')}
            </button>
          )}
        </div>
      </div>

      {loading && (
        <p className="text-sm text-on-surface-variant">
          {t('Se încarcă rezervările...')}
        </p>
      )}

      {error && (
        <p className="rounded-xl bg-red-500/10 p-4 text-sm text-red-400">
          {error}
        </p>
      )}

      {cancelError && (
        <p className="mb-4 rounded-xl bg-red-500/10 p-4 text-sm text-red-400">
          {cancelError}
        </p>
      )}

      {!loading && !error && bookings.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {(['All', 'Pending', 'Confirmed', 'Cancelled', 'Expired'] as const).map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setStatusFilter(filter)}
              className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
                statusFilter === filter
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
              }`}
            >
              {filter === 'All' ? t('Toate') : statusLabel(filter)}
              <span className="ml-1 opacity-70">
                {filter === 'All'
                  ? bookings.length
                  : bookings.filter((booking) => booking.status === filter).length}
              </span>
            </button>
          ))}
        </div>
      )}

      {!loading && !error && bookings.length === 0 && (
        <p className="rounded-xl border border-dashed border-surface-container-high p-8 text-center text-on-surface-variant">
          {t('Nu ai încă rezervări.')}
        </p>
      )}

      {!loading && !error && bookings.length > 0 && visibleBookings.length === 0 && (
        <p className="rounded-xl border border-dashed border-surface-container-high p-8 text-center text-on-surface-variant">
          {t('Nu există rezervări cu acest status.')}
        </p>
      )}

      {!loading && !error && visibleBookings.length > 0 && (
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {visibleBookings.map((booking) => (
            <article
              key={booking.id}
              className="rounded-2xl border border-white/5 bg-surface-container p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-on-surface">
                    {booking.fieldName}
                  </h3>
                  <p className="mt-1 text-sm text-on-surface-variant">
                    {new Intl.DateTimeFormat(language === 'ro' ? 'ro-RO' : 'en-GB', {
                      dateStyle: 'medium',
                      timeZone: 'Europe/Bucharest',
                      localeMatcher: 'best fit',
                    }).format(new Date(booking.startTime))}
                  </p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusClass(booking.status)}`}>
                  {statusLabel(booking.status)}
                </span>
              </div>

              <p className="mt-4 text-sm text-on-surface">
                {new Intl.DateTimeFormat(language === 'ro' ? 'ro-RO' : 'en-GB', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                  timeZone: 'Europe/Bucharest',
                }).format(new Date(booking.startTime))}
                {' - '}
                {new Intl.DateTimeFormat(language === 'ro' ? 'ro-RO' : 'en-GB', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                  timeZone: 'Europe/Bucharest',
                }).format(new Date(booking.endTime))}
              </p>

              {(booking.status === 'Pending' || booking.status === 'Confirmed') && (
                <button
                  type="button"
                  disabled={cancellingBookingId === booking.id}
                  onClick={() => void handleCancelBooking(booking)}
                  className="mt-4 rounded-xl bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-400 hover:bg-red-500/20 disabled:cursor-wait disabled:opacity-50"
                >
                  {cancellingBookingId === booking.id
                    ? t('Se anulează...')
                    : t('Anulează rezervarea')}
                </button>
              )}
              {booking.status === 'Cancelled' && (
                <>
                {booking.cancellationReason && (
                  <p className="mt-3 text-xs text-on-surface-variant">
                    {t('Motiv')}: {booking.cancellationReason}
                  </p>
                )}
                <button
                  type="button"
                  disabled={deletingBookingId === booking.id}
                  onClick={() => void handleDeleteBooking(booking)}
                  className="mt-4 rounded-xl bg-surface-container-high px-4 py-2 text-sm font-semibold text-on-surface-variant hover:bg-surface-container-highest disabled:cursor-wait disabled:opacity-50"
                >
                  {deletingBookingId === booking.id
                    ? t('Se șterge...')
                    : t('Șterge din istoric')}
                </button>
                </>
              )}
            </article>
          ))}
        </div>
      )}
      </div>
    </section>
  );
}
