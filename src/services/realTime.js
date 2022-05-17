import {
  ref, onValue, update,
} from 'firebase/database';
import { realTimeDB } from '../config/firebase';

export async function listeningRealTime(channel) {
  const refListening = ref(realTimeDB, channel);
  onValue(refListening, (snapshot) => {
    const data = snapshot.val();
    console.log(`Listenning changes in channel ${channel}: `, data); // Notifications component
  });
}

export async function emitRealTime(channel, object) {
  const refEmit = ref(realTimeDB, channel);
  update(refEmit, object);
}
