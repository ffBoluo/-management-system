import Vue from 'vue'
import { Form, FormItem, Input, Button, Message, Container, Header, Aside, Main, Submenu, MenuItemGroup, Menu, MenuItem, Breadcrumb, BreadcrumbItem, Card, Col, Row, Table, TableColumn, Switch, Tooltip, Pagination, Dialog, MessageBox, Tag, CollapseItem, Tree, Select, Option } from 'element-ui'
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Button)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
Vue.use(Menu)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Col)
Vue.use(Row)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(CollapseItem)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)

// message要挂在到全局
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm