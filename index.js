import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import App from './App';
import AppNavigators from './src/navigator/AppNavigators';

AppRegistry.registerComponent(appName, () => AppNavigators);
