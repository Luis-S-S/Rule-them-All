import {
  ref, onValue, set,
} from 'firebase/database';
import { realTimeDB } from '../config/firebase';

export async function listeningRealTime(channel, setProp, lastInviteChecked) {
  if (channel) {
    let data;
    const refListening = ref(realTimeDB, channel);
    onValue(refListening, (snapshot) => {
      data = snapshot.val();
      if (lastInviteChecked < data?.invitationTime) {
        setProp(data);
        setTimeout(() => { setProp(null); }, 10_000);
      }
    });
  }
}

export async function emitRealTime(channel, object) {
  const refEmit = ref(realTimeDB, channel);
  set(refEmit, object);
}
