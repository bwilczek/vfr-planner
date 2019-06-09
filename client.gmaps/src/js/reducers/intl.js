import { addLocaleData } from 'react-intl'
import plLocaleData from 'react-intl/locale-data/pl'
import { intlReducer } from 'react-intl-redux'

addLocaleData([
  ...plLocaleData,
])

export default intlReducer
