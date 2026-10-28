import { useCallback, useEffect, useState } from 'react';
import { CalendarDays, CheckCircle2, Clock3, RefreshCw, UserRound, XCircle } from 'lucide-react';
import {
  cancelBookingAsOwner,
  confirmBooking,
  deleteCancelledBooking,
  getOwnerBookingStats,
  getOwnerBookings,
} from '../utils/api';
import type { Booking, OwnerBookingStats } from '../types/booking';
import { useLanguage } from '../context/LanguageContext';

function formatDate(value: string, language: 'ro' | 'en') {
  return new Intl.DateTimeFormat(language === 'ro' ? 'ro-RO' : 'en-GB', {
    dateStyle: 'medium',
    timeZone: 'Europe/Bucharest',
  }).format(new Date(value));
}

function getBookingDate(value: string): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Bucharest',
  }).format(new Date(value));
}

function formatTime(value: string, language: 'ro' | 'en') {
  return new Intl.DateTimeFormat(language === 'ro' ? 'ro-RO' : 'en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Europe/Bucharest',
  }).format(new Date(value));
}

function statusClass(status: Booking['status']) {
  if (status === 'Confirmed') return 'bg-emerald-500/10 text-emerald-400';
  if (status === 'Cancelled') return 'bg-red-500/10 text-red-400';
  if (status === 'Expired') return 'bg-slate-500/20 text-slate-400';
  return 'bg-amber-500/10 text-amber-400';
}

function getLocalDate(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Bucharest',
  }).format(new Date());
}

export function OwnerBookings() {
  const { language, t } = useLanguage();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [statusFilter, setStatusFilter] = useState<'All' | Booking['status']>('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmingBookingId, setConfirmingBookingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [deletingBookingId, setDeletingBookingId] = useState<string | null>(null);
  const [cancellingBookingId, setCancellingBookingId] = useState<string | null>(null);
  const [cancellationBooking, setCancellationBooking] = useState<Booking | null>(null);
  const [cancellationReason, setCancellationReason] = useState('');
  const [stats, setStats] = useState<OwnerBookingStats | null>(null);
  const [selectedDate, setSelectedDate] = useState(getLocalDate);

  const loadBookings = useCallback(() => {
    setLoading(true);
    setError(null);
    Promise.all([getOwnerBookings(), getOwnerBookingStats()])
      .then(([loadedBookings, loadedStats]) => {
        setBookings(loadedBookings);
        setStats(loadedStats);
      })
      .catch((requestError) => {
        setError(
          requestError instanceof Error
            ? requestError.message
            : t('Rezervările nu au putut fi încărcate.'),
        );
      })
      .finally(() => setLoading(false));
  }, [t]);

  useEffect(() => {
    let isCurrent = true;

    Promise.all([getOwnerBookings(), getOwnerBookingStats()])
      .then(([loadedBookings, loadedStats]) => {
        if (isCurrent) {
          setBookings(loadedBookings);
          setStats(loadedStats);
        }
      })
      .catch((requestError) => {
        if (isCurrent) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : t('Rezervările nu au putut fi încărcate.'),
          );
        }
      })
      .finally(() => {
        if (isCurrent) setLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [t]);

  const handleConfirm = async (booking: Booking) => {
    if (booking.status !== 'Pending') return;

    setConfirmingBookingId(booking.id);
    setActionError(null);
    try {
      await confirmBooking(booking.id);
      await loadBookings();
    } catch (requestError) {
      setActionError(
        requestError instanceof Error
          ? requestError.message
          : t('Rezervarea nu a putut fi confirmată.'),
      );
    } finally {
      setConfirmingBookingId(null);
    }
  };

  const handleDelete = async (booking: Booking) => {
    if (booking.status !== 'Cancelled') return;
    if (!window.confirm(`${t('Ștergi definitiv rezervarea pentru')} ${booking.fieldName}?`)) return;

    setDeletingBookingId(booking.id);
    setActionError(null);
    try {
      await deleteCancelledBooking(booking.id);
      setBookings((currentBookings) =>
        currentBookings.filter((currentBooking) => currentBooking.id !== booking.id),
      );
    } catch (requestError) {
      setActionError(
        requestError instanceof Error
          ? requestError.message
          : t('Rezervarea nu a putut fi ștearsă.'),
      );
    } finally {
      setDeletingBookingId(null);
    }
  };

  const handleOwnerCancel = async (booking: Booking) => {
    if (booking.status !== 'Pending' && booking.status !== 'Confirmed') return;
    setCancellationBooking(booking);
    setCancellationReason('');
  };

  const submitOwnerCancellation = async () => {
    if (!cancellationBooking || !cancellationReason.trim()) return;

    setCancellingBookingId(cancellationBooking.id);
    setActionError(null);
    try {
      await cancelBookingAsOwner(cancellationBooking.id, cancellationReason.trim());
      setCancellationBooking(null);
      await loadBookings();
    } catch (requestError) {
      setActionError(
        requestError instanceof Error
          ? requestError.message
          : t('Rezervarea nu a putut fi anulată.'),
      );
    } finally {
      setCancellingBookingId(null);
    }
  };

  const visibleBookings = statusFilter === 'All'
    ? bookings
    : bookings.filter((booking) => booking.status === statusFilter);

  const statusLabel = (status: Booking['status']) => {
    if (status === 'Confirmed') return t('Confirmată');
    if (status === 'Cancelled') return t('Anulată');
    if (status === 'Expired') return t('Expirată');
    return t('În așteptare');
  };

  const calendarBookings = bookings.filter((booking) =>
    getBookingDate(booking.startTime) === selectedDate &&
    booking.status !== 'Cancelled',
  );

  return (
    <section id="rezervari-primite" className="scroll-mt-24 space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-on-surface">{t('Rezervări primite')}</h2>
          <p className="mt-1 text-sm text-on-surface-variant">
            {t('Gestionează cererile pentru terenurile tale.')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {!loading && !error && (
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
              {bookings.length} {bookings.length === 1 ? t('rezervare') : t('rezervări')}
            </span>
          )}
          <button
            type="button"
            onClick={loadBookings}
            disabled={loading}
            aria-label={t('Reîncarcă rezervările')}
            className="rounded-xl bg-surface-container-high p-2.5 text-on-surface-variant hover:bg-surface-container-highest disabled:cursor-wait disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {loading && <p className="text-sm text-on-surface-variant">{t('Se încarcă rezervările...')}</p>}
      {error && <p className="rounded-xl bg-red-500/10 p-4 text-sm text-red-400">{error}</p>}
      {actionError && (
        <p className="rounded-xl bg-red-500/10 p-4 text-sm text-red-400">{actionError}</p>
      )}

      {stats && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [t('În așteptare'), stats.pendingCount, 'text-amber-400'],
            [t('Confirmate'), stats.confirmedCount, 'text-emerald-400'],
            [t('Venit estimat'), `${stats.estimatedRevenue} RON`, 'text-primary'],
            [t('Grad de ocupare'), `${stats.occupancyPercentage}%`, 'text-secondary'],
          ].map(([label, value, color]) => (
            <div key={String(label)} className="rounded-2xl border border-white/5 bg-surface-container p-4">
              <p className="text-xs text-on-surface-variant">{label}</p>
              <p className={`mt-1 text-xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-2xl border border-white/5 bg-surface-container p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="flex items-center gap-2 font-bold text-on-surface">
              <CalendarDays className="h-5 w-5 text-primary" />
              {t('Calendar rezervări')}
            </h3>
            <p className="mt-1 text-sm text-on-surface-variant">
              {t('Vezi rezervările programate pentru o zi.')}
            </p>
          </div>
          <input
            type="date"
            value={selectedDate}
            onChange={(event) => setSelectedDate(event.target.value)}
            className="rounded-xl bg-surface-container-high px-3 py-2 text-sm text-on-surface"
          />
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {calendarBookings.length === 0 && (
            <p className="text-sm text-on-surface-variant">{t('Nu există rezervări în această zi.')}</p>
          )}
          {calendarBookings.map((booking) => (
            <div key={booking.id} className="rounded-xl bg-surface-container-high p-3">
              <p className="text-sm font-bold text-on-surface">{formatTime(booking.startTime, language)}</p>
              <p className="mt-1 text-xs text-on-surface-variant">{booking.fieldName}</p>
              <p className="text-xs text-on-surface-variant">{booking.playerName}</p>
            </div>
          ))}
        </div>
      </div>

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
        <p className="rounded-2xl border border-dashed border-surface-container-high bg-surface-container p-8 text-center text-on-surface-variant">
          {t('Nu există încă rezervări pentru terenurile tale.')}
        </p>
      )}

      {!loading && !error && bookings.length > 0 && visibleBookings.length === 0 && (
        <p className="rounded-2xl border border-dashed border-surface-container-high bg-surface-container p-8 text-center text-on-surface-variant">
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
                  <h3 className="text-lg font-bold text-on-surface">{booking.fieldName}</h3>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-on-surface-variant">
                    <UserRound className="h-4 w-4 text-primary" />
                    {booking.playerName}
                  </p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusClass(booking.status)}`}>
                  {statusLabel(booking.status)}
                </span>
              </div>

              <div className="mt-4 flex items-center gap-2 text-sm text-on-surface">
                <Clock3 className="h-4 w-4 text-primary" />
                <span>{formatDate(booking.startTime, language)}</span>
                <span className="text-on-surface-variant">·</span>
                <span>{formatTime(booking.startTime, language)} - {formatTime(booking.endTime, language)}</span>
              </div>

              {booking.status === 'Pending' && (
                <button
                  type="button"
                  disabled={confirmingBookingId === booking.id}
                  onClick={() => void handleConfirm(booking)}
                  className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-400 hover:bg-emerald-500/20 disabled:cursor-wait disabled:opacity-50"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  {confirmingBookingId === booking.id ? t('Se confirmă...') : t('Confirmă rezervarea')}
                </button>
              )}
              {(booking.status === 'Pending' || booking.status === 'Confirmed') && (
                <button
                  type="button"
                  disabled={cancellingBookingId === booking.id}
                  onClick={() => void handleOwnerCancel(booking)}
                  className="mt-4 ml-2 inline-flex items-center gap-2 rounded-xl bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-400 hover:bg-red-500/20 disabled:cursor-wait disabled:opacity-50"
                >
                  <XCircle className="h-4 w-4" />
                  {cancellingBookingId === booking.id ? t('Se anulează...') : t('Anulează rezervarea')}
                </button>
              )}
              {booking.status === 'Cancelled' && booking.cancellationReason && (
                <p className="mt-3 text-xs text-on-surface-variant">
                  {t('Motiv')}: {booking.cancellationReason}
                </p>
              )}
              {booking.status === 'Cancelled' && (
                <button
                  type="button"
                  disabled={deletingBookingId === booking.id}
                  onClick={() => void handleDelete(booking)}
                  className="mt-4 rounded-xl bg-surface-container-high px-4 py-2 text-sm font-semibold text-on-surface-variant hover:bg-surface-container-highest disabled:cursor-wait disabled:opacity-50"
                >
                  {deletingBookingId === booking.id ? t('Se șterge...') : t('Șterge din istoric')}
                </button>
              )}
            </article>
          ))}
        </div>
      )}
      {cancellationBooking && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="owner-cancellation-title"
        >
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-surface-container p-6 shadow-2xl">
            <h3 id="owner-cancellation-title" className="text-lg font-bold text-on-surface">
              {t('Anulează rezervarea')}
            </h3>
            <p className="mt-2 text-sm text-on-surface-variant">
              {cancellationBooking.fieldName} · {cancellationBooking.playerName}
            </p>
            <label className="mt-5 block text-sm font-semibold text-on-surface">
              {t('Motivul anulării')}
              <textarea
                value={cancellationReason}
                onChange={(event) => setCancellationReason(event.target.value)}
                maxLength={500}
                rows={4}
                autoFocus
                className="mt-2 w-full resize-none rounded-xl bg-surface-container-high px-3 py-2.5 text-sm text-on-surface outline-none ring-primary/50 focus:ring-2"
              />
            </label>
            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setCancellationBooking(null)}
                disabled={cancellingBookingId !== null}
                className="rounded-xl bg-surface-container-high px-4 py-2 text-sm font-semibold text-on-surface-variant hover:bg-surface-container-highest disabled:opacity-50"
              >
                {t('Renunță')}
              </button>
              <button
                type="button"
                onClick={() => void submitOwnerCancellation()}
                disabled={!cancellationReason.trim() || cancellingBookingId !== null}
                className="rounded-xl bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-400 hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {cancellingBookingId !== null ? t('Se anulează...') : t('Confirmă anularea')}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
