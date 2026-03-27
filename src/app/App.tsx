import { StatusBar } from 'react-native';

import { RootNavigator } from '@navigation/RootNavigator';

export default function App() {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <RootNavigator />
    </>
  );
}
