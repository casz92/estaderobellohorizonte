// backend/events.js
import { generatePrompt } from 'backend/prompt_generator';
import { putPrompt } from 'backend/api';

export function wixBookings_onBookingCreated(event) {
  generatePrompt().then(text => {
    if (text.length > 0) putPrompt(text);
  });
}

export function wixBookings_onBookingCancelled(event) {
  generatePrompt().then(text => {
    if (text.length > 0) putPrompt(text);
  });
}