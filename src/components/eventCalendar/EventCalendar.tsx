import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { format } from 'date-fns';
import { useLocale } from 'use-intl';
import amLocale from '@fullcalendar/core/locales/hy-am';
import enLocale from '@fullcalendar/core/locales/en-gb';
import { doc, getDoc, setDoc } from '@firebase/firestore';
import { EventInput } from '@fullcalendar/core';
import Image from 'next/image';
import { db } from '@/firebase/config';
import styles from './EventCalendar.module.css';

interface IProps {
  user: any;
  events: EventInput[];
  setEvents: React.Dispatch<React.SetStateAction<EventInput[]>>;
  handleDateClick: (info: DateClickArg) => void;
  setSelectedEvent: React.Dispatch<React.SetStateAction<EventInput>>;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const EventCalendar: React.FC<IProps> = ({
  user,
  events,
  setEvents,
  handleDateClick,
  setSelectedEvent,
  setShowModal,
}) => {
  const locale = useLocale();
  const currentLocale = locale === 'hy' ? amLocale : enLocale;

  const handleDeleteEvent = async (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));

    try {
      if (!user?.uid) return;
      const calendarRef = doc(db, 'calendar', user.uid);
      const docSnap = await getDoc(calendarRef);

      if (docSnap.exists()) {
        const existingEvents = docSnap.data().events || [];
        const updatedEvents = existingEvents.filter((e: any) => e.id !== id);
        await setDoc(calendarRef, {
          localId: user.uid,
          events: updatedEvents,
        });
      }
    } catch (error) {
      console.error('Failed to delete event:', error);
    }
  };

  const renderEventContent = (eventInfo: any) => {
    const date = new Date(eventInfo.event.start);

    return (
      <div className={styles['event-container']}>
        <div className={styles['event-info']}>
          <span className={styles['event-title']}>{eventInfo.event.title}</span>
          <span className={styles['event-date']}>{format(date, 'dd.MM.yyyy, HH:mm')}</span>
        </div>
        <div className={styles['event-buttons']}>
          <button
            className={styles['delete-button']}
            onClick={() => {
              setSelectedEvent(eventInfo.event);
              setShowModal(true);
            }}
          >
            <Image alt="Pencil icon" height={24} src="/icons/pencil.svg" width={24} />
          </button>
          <button
            className={styles['delete-button']}
            onClick={() => handleDeleteEvent(eventInfo.event.id)}
          >
            <Image alt="Pencil icon" height={24} src="/icons/close.svg" width={24} />
          </button>
        </div>
      </div>
    );
  };

  const weekdayMap = {
    hy: ['Երկուշաբթի', 'Երեքշաբթի', 'Չորեքշաբթի', 'Հինգշաբթի', 'Ուրբաթ', 'Շաբաթ', 'Կիրակի'],
    en: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  };

  const monthNames = {
    hy: [
      'Հունվար',
      'Փետրվար',
      'Մարտ',
      'Ապրիլ',
      'Մայիս',
      'Հունիս',
      'Հուլիս',
      'Օգոստոս',
      'Սեպտեմբեր',
      'Հոկտեմբեր',
      'Նոյեմբեր',
      'Դեկտեմբեր',
    ],
    en: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
  };

  return (
    <FullCalendar
      aspectRatio={1.5}
      dateClick={handleDateClick}
      dayHeaderContent={(args) => weekdayMap[locale as 'en' | 'hy'][args.date.getDay()]}
      eventContent={renderEventContent}
      events={events}
      headerToolbar={{
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,dayGridWeek,dayGridDay',
      }}
      height="80vh"
      initialView="dayGridMonth"
      locale={currentLocale}
      plugins={[dayGridPlugin, interactionPlugin]}
      titleFormat={(date) => {
        const month = monthNames[locale as 'en' | 'hy'][date.date.month];
        const year = date.date.year;
        return `${month} ${year}`;
      }}
    />
  );
};

export default EventCalendar;
