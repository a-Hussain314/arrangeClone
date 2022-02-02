import I18n, { getLanguages } from 'react-native-i18n';

import ar from './ar';
import en from './en';

I18n.fallbacks = true;

I18n.translations = {
  ar,
  en,
};

export default I18n;
