'use client';

import { DateClickArg } from '@fullcalendar/interaction';
import { EventInput } from '@fullcalendar/core';
import { useEffect, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { doc, getDoc } from '@firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import withAuth from '@/lib/withAuth';
import { db, auth } from '@/firebase/config';
import EventCalendar from '@/components/eventCalendar/EventCalendar';
import EventModal from '@/components/eventModal/EventModal';
import styles from './page.module.css';

function CalendarPage() {
  const [events, setEvents] = useState<EventInput[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [newEventDate, setNewEventDate] = useState<Date | null>(null);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [selectedEvent, setSelectedEvent] = useState<EventInput>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [user] = useAuthState(auth);

  useEffect(() => {
    const fetchEvents = async () => {
      if (!user?.uid) return;

      try {
        const calendarRef = doc(db, 'calendar', user.uid);
        const docSnap = await getDoc(calendarRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const dbEvents = (data.events || []).map((e: any) => ({
            id: e.id,
            title: e.title,
            start: new Date(e.start),
            extendedProps: { description: e.description },
          }));

          setEvents(dbEvents);
        }
      } catch (error) {
        console.error('Error loading events:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [user]);

  const handleDateClick = (info: DateClickArg) => {
    setNewEventDate(new Date(info.dateStr));
    setTitle('');
    setDescription('');
    setShowModal(true);
  };

  if (isLoading) {
    return null;
  }

  return (
    <div className={styles.container}>
      <EventCalendar
        events={events}
        handleDateClick={handleDateClick}
        setEvents={setEvents}
        setSelectedEvent={setSelectedEvent}
        setShowModal={setShowModal}
        user={user}
      />
      <EventModal
        description={description}
        newEventDate={newEventDate}
        selectedEvent={selectedEvent}
        setDescription={setDescription}
        setEvents={setEvents}
        setNewEventDate={setNewEventDate}
        setShowModal={setShowModal}
        setTitle={setTitle}
        showModal={showModal}
        title={title}
        user={user}
      />
    </div>
  );
}

export default withAuth(CalendarPage);
