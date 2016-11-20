import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import enquire from 'enquire.js';

import Menu from 'antd/lib/menu';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Icon from 'antd/lib/icon';
import Button from 'antd/lib/button';
import Popover from 'antd/lib/popover';
import Input from 'antd/lib/input';
import Modal from 'antd/lib/modal';

import 'antd/dist/antd.css';

import Login from '../components/Login';
import Signup from '../components/Signup';


import classNames from 'classnames';
const InputGroup = Input.Group;
const SubMenu = Menu.SubMenu;

// See https://github.com/ant-design/ant-design/blob/master/components/input/demo/search-input.md
const SearchInput = React.createClass({
  getInitialState() {
    return {
      value: '',
      focus: false,
    };
  },
  handleInputChange(e) {
    this.setState({
      value: e.target.value,
    });
  },
  handleFocusBlur(e) {
    this.setState({
      focus: e.target === document.activeElement,
    });
  },
  handleSearch() {
    if (this.props.onSearch) {
      this.props.onSearch(this.state.value);
    }
  },
  render() {
    const { style, size, placeholder } = this.props;
    const btnCls = classNames({
      'ant-search-btn': true,
      'ant-search-btn-noempty': !!this.state.value.trim(),
    });
    const searchCls = classNames({
      'ant-search-input': true,
      'ant-search-input-focus': this.state.focus,
    });
    return (
      <div className="ant-search-input-wrapper" style={style}>
        <InputGroup className={searchCls}>
          <Input placeholder={placeholder} value={this.state.value} onChange={this.handleInputChange}
                 onFocus={this.handleFocusBlur} onBlur={this.handleFocusBlur} onPressEnter={this.handleSearch}
          />
          <div className="ant-input-group-wrap">
            <Button icon="search" className={btnCls} size={size} onClick={this.handleSearch} />
          </div>
        </InputGroup>
      </div>
    );
  },
});


const LoginSignup = React.createClass({
  getInitialState() {
    return { loginVisible: false, signupVisible: false };
  },
  showLogin() {
    this.setState({
      loginVisible: true,
    });
  },
  handleLoginCancel() {
    this.setState({
      loginVisible: false,
    });
  },
  showSignup() {
    this.setState({
      signupVisible: true,
    });
  },
  handleSignupCancel() {
    this.setState({
      signupVisible: false,
    });
  },
  render() {
    return (
      <div className="lang">
        <Button type="ghost" onClick={this.showLogin}>
          登录
        </Button>
        <Button type="ghost" onClick={this.showSignup}>
          注册
        </Button>
        { this.state.loginVisible ?
          <Modal title="登录" visible={this.state.loginVisible} width={334}
                 onOk={this.handleLoginOK} onCancel={this.handleLoginCancel}
                 footer={[
                   null, null,
                 ]}
                 maskClosable={false}
          >
            <Login/>
          </Modal>
          : ''
        }
        { this.state.signupVisible ?
          <Modal title="注册" visible={this.state.signupVisible} width={334}
                 onOk={this.handleSignupOK} onCancel={this.handleSignupCancel}
                 footer={[
                   null, null,
                 ]}
                 maskClosable={false}
          >
            <Signup/>
          </Modal>
          : ''
        }
      </div>
    )
  },
});

class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      menuMode: 'horizontal',
    };
  }

  componentDidMount() {
    enquire.register('only screen and (min-width: 320px) and (max-width: 940px)', {
      match: () => {
        this.setState({ menuMode: 'inline' });
      },
      unmatch: () => {
        this.setState({ menuMode: 'horizontal' });
      },
    });
  }

  render() {
    const { activeMenu } = this.props;
    let activeMenuItem = activeMenu || 'home';

    const headerClassName = classNames({
      clearfix: true,
      'home-nav-white': true,
    });

    let menu;
    if (this.props.currentUser) {
      menu = [
        <Menu mode={this.state.menuMode} selectedKeys={[activeMenuItem]} id="nav" key="nav">
          <Menu.Item key="home">
            <a href="/">首页</a>
          </Menu.Item>
          <Menu.Item key="todo">
            <a href="/todo">Todo</a>
          </Menu.Item>
          <SubMenu title={<span><Icon type="user"/>{this.props.currentUser.username}</span>} id="navsubmenu">
            <Menu.Item key="user">
              <a href={'/user/' + this.props.currentUser.username}>我的主页</a>
            </Menu.Item>
            <Menu.Item key="inbox">
              <a href='/inbox'>私信</a>
            </Menu.Item>
            <Menu.Item key="settings">
              <a href='/settings'>设置</a>
            </Menu.Item>
            <Menu.Item key="logout">
              <a href='/logout'>退出</a>
            </Menu.Item>
          </SubMenu>
        </Menu>,
      ]
    } else {
      menu = [
        <LoginSignup key='loginsignup'/>,
        <Menu mode={this.state.menuMode} selectedKeys={[activeMenuItem]} id="nav" key="nav">
          <Menu.Item key="home">
            <a href="/">首页</a>
          </Menu.Item>
          <Menu.Item key="todo">
            <a href="/todo">Todo</a>
          </Menu.Item>
        </Menu>,
      ]
    }

    return (
      <header id="header" className={headerClassName}>
        {this.state.menuMode === 'inline' ? <Popover
          overlayClassName="popover-menu"
          placement="bottomRight"
          content={menu}
          trigger="click"
          arrowPointAtCenter
        >
          <Icon
            className="nav-phone-icon"
            type="menu"
          />
        </Popover> : null}
        <Row>
          <Col lg={4} md={6} sm={24} xs={24}>
            <a href="/" id="logo">
              <img alt="logo" src="https://t.alipayobjects.com/images/rmsweb/T1B9hfXcdvXXXXXXXX.svg" />
              <span>Ant Design</span>
            </a>
          </Col>
          <Col lg={20} md={18} sm={17} xs={0} style={{ display: 'block' }}>
            <div id="search-box">
              <SearchInput placeholder="搜索你感兴趣的内容..."
                           onSearch={value => console.log(value)} style={{ width: 300 }}
              />
            </div>
            {this.state.menuMode === 'horizontal' ? menu : null}
          </Col>
        </Row>
      </header>
    );
  }
}

Header.propTypes = {
  currentUser: React.PropTypes.object,
};

export default createContainer(() => {
  return {
    currentUser: Meteor.user(),
  };
}, Header);