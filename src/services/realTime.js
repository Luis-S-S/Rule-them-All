import {
  ref, onValue, set,
} from 'firebase/database';
import { realTimeDB } from '../config/firebase';

export async function listeningRealTime(channel, setProp) {
  if (channel) {
    let data;
    const refListening = ref(realTimeDB, channel);
    onValue(refListening, (snapshot) => {
      data = snapshot.val();
      console.log(`Listenning changes in channel ${channel}: `, data); // Notifications component
      setProp(data);
      setTimeout(() => { setProp(null); }, 5000);
    });
  }
}

export async function emitRealTime(channel, object) {
  const refEmit = ref(realTimeDB, channel);
  set(refEmit, object);
}
