import type { EmergencyContact } from "@/types";
import { useCallback, useState } from "react";

const STORAGE_KEY = "emergency-contacts";

function loadContacts(): EmergencyContact[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as EmergencyContact[];
  } catch {
    // localStorage unavailable or parse error
  }
  return [];
}

function saveContacts(contacts: EmergencyContact[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
  } catch {
    // localStorage unavailable
  }
}

export function useContacts(): [
  EmergencyContact[],
  (name: string, phone: string) => void,
  (id: string) => void,
] {
  const [contacts, setContacts] = useState<EmergencyContact[]>(loadContacts);

  const addContact = useCallback((name: string, phone: string) => {
    const newContact: EmergencyContact = {
      id: `contact-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: name.trim(),
      phone: phone.trim(),
    };
    setContacts((prev) => {
      const updated = [...prev, newContact];
      saveContacts(updated);
      return updated;
    });
  }, []);

  const deleteContact = useCallback((id: string) => {
    setContacts((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      saveContacts(updated);
      return updated;
    });
  }, []);

  return [contacts, addContact, deleteContact];
}
