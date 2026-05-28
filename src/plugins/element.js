import Vue from 'vue';
import {
  Loading,
  Input,
  Select,
  Option,
  Button,
  Pagination,
  Form,
  FormItem,
  Breadcrumb,
  BreadcrumbItem,
  Table,
  TableColumn,
  Radio,
  RadioGroup,
  RadioButton,
  Message,
  MessageBox,
  Checkbox,
  Popover,
  Tabs,
  TabPane,
  Collapse,
  CollapseItem,
  Image,
  Tooltip,
  Dialog,
  Switch,
  Link
} from 'element-ui';


Vue.use(Loading.directive);
Vue.use(Input);
Vue.use(Select);
Vue.use(Option);
Vue.use(Button);
Vue.use(Pagination);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(RadioButton);
Vue.use(Checkbox);
Vue.use(Popover);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(Image);
Vue.use(Tooltip);
Vue.use(Dialog);
Vue.use(Switch);
Vue.use(Link);

Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$loading = Loading.service;
