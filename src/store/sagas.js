import { spawn } from 'redux-saga/effects';
import weatherSaga from '../store/sagas/saga';

export default function* root() {
  yield spawn(weatherSaga);
}
