import React, { useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { doc, getDoc, setDoc, updateDoc } from '@firebase/firestore';
import { EventInput } from '@fullcalendar/core';
import Modal from '@/components/modal/Modal';
import Input from '@/components/input/Input';
import Button from '@/components/button/Button';
import { db } from '@/firebase/config';
import styles from './EventModal.module.css';

interface IProps {
  user: any;
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  newEventDate: Date | null;
  setNewEventDate: React.Dispatch<React.SetStateAction<Date | null>>;
  setEvents: React.Dispatch<React.SetStateAction<EventInput[]>>;
  selectedEvent?: EventInput;
}

const EventModal: React.FC<IProps> = ({
  user,
  showModal,
  setShowModal,
  title,
  setTitle,
  description,
  setDescription,
  newEventDate,
  setNewEventDate,
  setEvents,
  selectedEvent,
}) => {
  useEffect(() => {
    if (selectedEvent) {
      setTitle(selectedEvent.title || '');
      setDescription(selectedEvent?.description || '');
      setNewEventDate(selectedEvent?.start ? new Date(selectedEvent.start as Date) : new Date());
    } else {
      setTitle('');
      setDescription('');
      setNewEventDate(null);
    }
  }, [selectedEvent, setTitle, setDescription, setNewEventDate]);

  const handleSaveEvent = async () => {
    if (!title || !newEventDate || !user?.uid) return;

    const updatedEvent = {
      id: selectedEvent ? selectedEvent.id : Date.now().toString(),
      title,
      description,
      start: newEventDate.toISOString(),
      createdAt: selectedEvent ? selectedEvent.createdAt : new Date().toISOString(),
    };

    setEvents((prev) => {
      if (selectedEvent) {
        return prev.map((event) => (event.id === selectedEvent.id ? updatedEvent : event));
      } else {
        return [...prev, updatedEvent];
      }
    });

    setShowModal(false);

    try {
      const calendarRef = doc(db, 'calendar', user.uid);
      const docSnap = await getDoc(calendarRef);
      const currentEvents = docSnap.exists() ? docSnap.data().events || [] : [];

      let updatedEvents;
      if (selectedEvent) {
        updatedEvents = currentEvents.map((event: any) =>
          event.id === selectedEvent.id ? updatedEvent : event,
        );
      } else {
        updatedEvents = [...currentEvents, updatedEvent];
      }

      await setDoc(calendarRef, {
        localId: user.uid,
        events: updatedEvents,
      });
    } catch (error) {
      console.error('Failed to save event:', error);
    }
  };

  return (
    <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
      <div className={styles.form}>
        <h2 className={styles['form-title']}>{selectedEvent ? 'Edit Event' : 'Add New Event'}</h2>
        <Input label="Title" type="text" value={title} onChange={(value) => setTitle(value)} />
        <Input
          label="Description"
          type="text"
          value={description}
          onChange={(value) => setDescription(value)}
        />

        <DatePicker
          customInput={<Input label="Date & Time" onChange={() => {}} />}
          dateFormat="dd/MM/yyyy HH:mm"
          selected={newEventDate}
          timeFormat="HH:mm"
          showTimeSelect
          onChange={(date) => setNewEventDate(date)}
        />
        <div className={styles.buttons}>
          <Button text="Cancel" variant="secondary" onClick={() => setShowModal(false)} />
          <Button
            text={selectedEvent ? 'Update' : 'Add'}
            variant="primary"
            onClick={handleSaveEvent}
          />
        </div>
      </div>
    </Modal>
  );
};

export default EventModal;
