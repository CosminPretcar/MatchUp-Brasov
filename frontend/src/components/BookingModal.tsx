import { useEffect, useState } from 'react';
import { createBooking, getBookingAvailability } from '../utils/api';
import type { BookingAvailability } from '../types/booking';
import { X } from 'lucide-react';
import type { Field } from '../types/field';
import { useLanguage } from '../context/LanguageContext';

type BookingModalProps = {
  field: Field;
  onClose: () => void;
};

function getTomorrowDate(): string {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Europe/Bucharest',
    }).format(new Date(Date.now() + 24 * 60 * 60 * 1000));
}

function formatTime(value: string, language: 'ro' | 'en'): string {
    return new Intl.DateTimeFormat(language === 'ro' ? 'ro-RO' : 'en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'Europe/Bucharest',
    }).format(new Date(value));
}

export function BookingModal({ field, onClose }: BookingModalProps) {
  const { language, t } = useLanguage();
  const [selectedDate, setSelectedDate] = useState(getTomorrowDate());
  const [availability, setAvailability] = useState<BookingAvailability[]>([]);
  const [availabilityLoading, setAvailabilityLoading] = useState(true);
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<BookingAvailability | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            onClose();
        }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  useEffect(() => {
    let isCurrent = true;

    getBookingAvailability(field.id, selectedDate)
        .then((slots) => {
            if (isCurrent) {
              setAvailability(slots);
            }
        })
        .catch((error) => {
            if (isCurrent) {
              setAvailabilityError(
                error instanceof Error
                  ? error.message
                  : t('Disponibilitatea nu a putut fi încărcată.'),
              );
            }
        })
        .finally(() => {
            if (isCurrent) {
              setAvailabilityLoading(false);
            }
        });

    return () => {
        isCurrent = false;
    };
  }, [field.id, selectedDate, t]);

  const handleCreateBooking = async () => {
    if (!selectedSlot) return;

    setBookingLoading(true);
    setBookingError(null);
    setBookingSuccess(null);

    try {
      await createBooking({
        fieldId: field.id,
        startTime: selectedSlot.startTime,
      });

      setBookingSuccess(t('Rezervarea a fost creată cu succes.'));
      setSelectedSlot(null);

      try {
        const refreshedAvailability = await getBookingAvailability(field.id, selectedDate);
        setAvailability(refreshedAvailability);
      } catch {
        setAvailability([]);
      }
    } catch (error) {
      setBookingError(
        error instanceof Error
          ? error.message
          : t('Rezervarea nu a putut fi creată.'),
      );
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-lg rounded-2xl bg-surface-container p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="booking-modal-title" className="text-xl font-bold text-on-surface">
              {t('Rezervă terenul')}
            </h2>
            <p className="mt-1 text-sm text-on-surface-variant">
              {field.name}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
            aria-label={t('Închide')}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-on-surface">
            {t('Alege data')}
            <input
              type="date"
              value={selectedDate}
              min={getTomorrowDate()}
              onChange={(event) => {
                setSelectedDate(event.target.value);
                setAvailabilityLoading(true);
                setAvailabilityError(null);
                setAvailability([]);
                setSelectedSlot(null);
                setBookingError(null);
                setBookingSuccess(null);
              }}
              className="mt-2 w-full rounded-xl bg-surface-container-high px-3 py-2.5 text-on-surface"
            />
          </label>
        </div>
        <div className="mt-4">
          {availabilityLoading && (
            <p className="text-sm text-on-surface-variant">
              {t('Se încarcă disponibilitatea...')}
            </p>
          )}

          {availabilityError && (
            <p className="rounded-xl bg-red-500/10 p-3 text-sm text-red-400">
              {availabilityError}
            </p>
          )}

          {!availabilityLoading && !availabilityError && (
            <>
            <div className="grid grid-cols-2 gap-3">
              {availability.map((slot) => (
                <button
                  key={slot.startTime}
                  type="button"
                  disabled={!slot.isAvailable}
                  onClick={() => setSelectedSlot(slot)}
                  className={`rounded-xl border px-3 py-3 text-sm font-semibold transition ${
                    slot.isAvailable
                      ? selectedSlot?.startTime === slot.startTime
                        ? 'border-primary bg-primary/20 text-primary'
                        : 'border-surface-container-high bg-surface-container-high text-on-surface hover:border-primary'
                      : 'cursor-not-allowed border-surface-container-high opacity-40'
                  }`}
                >
                  <span className="block">
                    {formatTime(slot.startTime, language)} - {formatTime(slot.endTime, language)}
                  </span>
                  <span className="mt-1 block text-xs">
                    {slot.isAvailable ? t('Disponibil') : t('Indisponibil')}
                  </span>
                </button>
              ))}
            </div>
            {bookingError && (
              <p className="mt-4 rounded-xl bg-red-500/10 p-3 text-sm text-red-400">
                {bookingError}
              </p>
            )}

            {bookingSuccess && (
              <p className="mt-4 rounded-xl bg-emerald-500/10 p-3 text-sm text-emerald-400">
                {bookingSuccess}
              </p>
            )}

            <button
              type="button"
              disabled={!selectedSlot || bookingLoading}
              onClick={handleCreateBooking}
              className="mt-5 w-full rounded-xl bg-primary px-4 py-3 text-sm font-bold text-on-primary transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {bookingLoading ? t('Se creează rezervarea...') : t('Confirmă rezervarea')}
            </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}