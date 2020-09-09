import CommonHeader from './commonHeader.vue'
import ConfirmVue from './confirm/confirm'
import carIpt from './carIpt'
import Confirm1 from './confirm/index.js'
import PopupRadios from './popupRadios/index'
import { systemType } from '../../utils/app.js'
import SelectImage from './selectImage/SelectImage.js'
import {
  XHeader,
  XInput,
  XButton,
  Search,
  Group,
  PopupPicker,
  Cell,
  XTextarea,
  Actionsheet,
  Checker,
  CheckerItem,
  Datetime,
  Toast,
  XDialog,
  PopupRadio,
  Loading,
  Confirm,
  Popup,
  PopupHeader,
  Spinner,
  ToastPlugin,
  ConfirmPlugin,
  Flexbox,
  FlexboxItem,
  TransferDom,
  Popover,
  XSwitch,
  Alert,
  AlertPlugin,
  Divider,
  Previewer,
  Tab,
  TabItem
} from 'vux'
const install = (Vue, config = {}) => {
  Vue.use(SelectImage)
  Vue.use(Confirm1)
  Vue.use(ToastPlugin, { time: '3000' })
  Vue.use(ConfirmPlugin)
  Vue.use(AlertPlugin)
  Vue.$carIpt = Vue.prototype.$carIpt = carIpt
  Vue.$sysType = Vue.prototype.$sysType = systemType()
  Vue.directive('transfer-dom', TransferDom)
  Vue.use(PopupRadios)
  Vue.component('c-header', CommonHeader)
  Vue.component('x-header', XHeader)
  Vue.component('x-input', XInput)
  Vue.component('x-button', XButton)
  Vue.component('search', Search)
  Vue.component('group', Group)
  Vue.component('popup-picker', PopupPicker)
  Vue.component('cell', Cell)
  Vue.component('x-textarea', XTextarea)
  Vue.component('actionsheet', Actionsheet)
  Vue.component('checker', Checker)
  Vue.component('checker-item', CheckerItem)
  Vue.component('datetime', Datetime)
  Vue.component('toast', Toast)
  Vue.component('x-dialog', XDialog)
  Vue.component('popup-radio', PopupRadio)
  Vue.component('loading', Loading)
  Vue.component('confirm1', Confirm)
  Vue.component('confirm', ConfirmVue)
  Vue.component('popup', Popup)
  Vue.component('popup-header', PopupHeader)
  Vue.component('spinner', Spinner)
  Vue.component('flexbox', Flexbox)
  Vue.component('flexbox-item', FlexboxItem)
  Vue.component('popover', Popover)
  Vue.component('x-switch', XSwitch)
  Vue.component('alert', Alert)
  Vue.component('divider', Divider)
  Vue.component('previewer', Previewer)
  Vue.component('tab', Tab)
  Vue.component('tab-item', TabItem)
  Vue.component('popup-radios', PopupRadios)
}

export default install
