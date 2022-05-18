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
      console.log(`Listenned to ${channel} with ${data}`);
      setProp(data);
      setTimeout(() => { setProp(null); }, 10_000);
    });
  }
}

export async function emitRealTime(channel, object) {
  const refEmit = ref(realTimeDB, channel);
  console.log(`Emitted to ${channel} and received ${object}`);
  set(refEmit, object);
}
