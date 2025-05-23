import React, { Component } from 'react';
import {
  Container,
  Nav,
  Navbar,
  NavDropdown,
  Offcanvas,
} from 'react-bootstrap';
import {
  Book,
  Check2Square,
  ClockHistory,
  JournalCheck,
  List,
  Megaphone,
  Moisture,
  Search,
} from 'react-bootstrap-icons';
import styled from 'styled-components';
import ReactGA from 'react-ga4';

import type { AcademicYear, CourseDataFilesInfo } from '@/types';
import { WEBSITE_COLOR } from '../config';
import Banner from '../assets/banner.svg';

// 自定義 Navbar 樣式
const StyledNavbar = styled(Navbar)`
  background-color: ${WEBSITE_COLOR.mainColor};
  transition: top 0.3s; // 添加過渡效果
`;

const StyledNavLink = styled(Nav.Link)`
  color: white !important; // 預設為白色鏈接顏色

  &:hover,
  &:focus {
    color: white;
    background-color: transparent;
  }

  &.active {
    border-bottom: 2px solid white; // 當選中時，底部顯示白色邊框
  }

  @media (max-width: 767px) {
    border: 0;
    // Bootstrap 的中型螢幕斷點以下
    color: black !important; // 在 Offcanvas 中將鏈接顏色改為黑色
    &:hover,
    &:focus {
      color: black;
      background-color: lightgray;
    }

    &.active {
      background-color: lightgray;
    }
  }

  display: flex;
  align-items: center; // 確保內容垂直居中
`;

const StyledNavDropdown = styled(NavDropdown)`
  color: white !important;
  width: 100%;

  .dropdown-toggle {
    display: flex;
    align-items: center;

    // Cellery: 修改樣式
    color: black !important;
    background-color: #ffffffef !important;
    border-radius: 0.375rem;

    @media (max-width: 767px) {
      color: black !important;
    }
  }

  .dropdown-menu {
    left: auto !important;
    .dropdown-item {
      &:hover {
        color: white;
        background-color: ${WEBSITE_COLOR.mainDarkerColor};
      }
    }
  }

  // Cellery: 修改樣式
  // .nav-link {
  //     padding-right: 0 !important;
  //     padding-left: 0 !important;
  // }

  // Cellery: 修改樣式
  .version-formattedDate {
    font-size: 0.8rem;
    margin-left: 0.5rem;
    margin-right: 0.5rem;
    font-weight: 500;
    color: #00000077;
  }
`;

interface HeaderProps {
  currentTab: string;
  currentCourseHistoryData: string;
  availableCourseHistoryData: CourseDataFilesInfo[];
  onTabChange: (tab: string) => void;
  switchVersion: (version: CourseDataFilesInfo) => void;
  convertVersion: (version: string) => string | React.ReactNode;
  toggleExperimentalFeatures: () => void;
  isExperimentalFeaturesEnabled: boolean;
  selectedSemester: string;
  availableSemesters: AcademicYear;
  onSemesterChange: (semester: string) => void;
}

interface HeaderState {
  showOffcanvas: boolean;
  lastScrollY: number;
  showNavbar: boolean;
}

class Header extends Component<HeaderProps, HeaderState> {
  state = {
    showOffcanvas: false,
    lastScrollY: 0,
    showNavbar: true,
  };

  navTabs = [
    {
      title: '所有課程',
      icon: <Book />,
    },
    {
      title: '學期必修',
      icon: <JournalCheck />,
    },
    {
      title: '課程偵探',
      icon: <Search />,
    },
    {
      title: '已選匯出',
      icon: <Check2Square />,
    },
    {
      title: '公告',
      icon: <Megaphone />,
    },
  ];

  semesterCodeMap = {
    1: '上',
    2: '下',
    3: '暑',
  };

  /**
   * 切換 Offcanvas 顯示狀態
   */
  handleToggleOffcanvas = () => {
    this.setState({ showOffcanvas: !this.state.showOffcanvas });
  };

  /**
   * 點擊 Offcanvas 中的鏈接時，關閉 Offcanvas
   * @param tab 鏈接標題
   */
  handleNavClick = (tab: string) => {
    this.props.onTabChange(tab);

    // send ga4 event
    ReactGA.event({
      category: 'Tab Click',
      action: 'Click',
      label: tab,
    });

    if (this.state.showOffcanvas) {
      this.setState({ showOffcanvas: false });
    }
  };

  /**
   * 註冊 scroll 事件
   */
  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  /**
   * 移除 scroll 事件
   */
  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  /**
   * 將學期代碼轉換為顯示格式
   * @param semester 學期代碼
   */
  convertSemesterToDisplay = (semester: string) => {
    const year = semester.slice(0, -1);
    const semesterCode =
      this.semesterCodeMap[parseInt(semester.slice(-1)) as 1 | 2 | 3];
    return `${year} ${semesterCode}`;
  };

  /**
   * 註冊 scroll 事件
   */
  handleScroll = () => {
    const { lastScrollY } = this.state;
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      // 向下滾動
      this.setState({ showNavbar: false });
    } else {
      // 向上滾動
      this.setState({ showNavbar: true });
    }

    this.setState({ lastScrollY: currentScrollY });
  };

  render() {
    const {
      currentTab,
      currentCourseHistoryData,
      availableCourseHistoryData,
      switchVersion,
      convertVersion,
      toggleExperimentalFeatures,
      isExperimentalFeaturesEnabled,
      availableSemesters,
      selectedSemester,
      onSemesterChange,
    } = this.props;
    const currentVersionDisplay = convertVersion(currentCourseHistoryData);

    return (
      <StyledNavbar
        expand='md'
        style={{ top: this.state.showNavbar ? '0' : '-100%' }}
        fixed='top'
        variant='dark'
      >
        <Container fluid>
          <Navbar.Brand className='p-0 d-block d-md-none d-lg-block' href='#'>
            <img
              src={Banner}
              height='40'
              className='d-inline-block align-top'
              alt='中山大學選課助手v5.0.0'
            />
          </Navbar.Brand>
          <Navbar.Toggle
            aria-controls='offcanvasNavbar'
            onClick={this.handleToggleOffcanvas}
          >
            <List size={24} color='white' />
          </Navbar.Toggle>
          <Navbar.Offcanvas
            id='offcanvasNavbar'
            aria-labelledby='offcanvasNavbarLabel'
            placement='start'
            show={this.state.showOffcanvas}
            onHide={this.handleToggleOffcanvas}
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id='offcanvasNavbarLabel'>
                切換設定區
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body className='p-0'>
              <Nav
                className='justify-content-start flex-grow-1'
                activeKey={currentTab}
              >
                <Nav.Item className='d-flex align-items-center'>
                  {!isExperimentalFeaturesEnabled && (
                    <StyledNavDropdown
                      title={
                        currentVersionDisplay ? (
                          <>
                            <ClockHistory />
                            <span className='ms-2'>
                              {currentVersionDisplay}
                            </span>
                          </>
                        ) : (
                          '找尋資料中...'
                        )
                      }
                      id='nav-dropdown-course-history'
                      className='px-3 float-start'
                    >
                      {availableCourseHistoryData.map((data, index) => (
                        <NavDropdown.Item
                          key={index}
                          onClick={() => switchVersion(data)}
                        >
                          {convertVersion(data.name)}
                        </NavDropdown.Item>
                      ))}
                    </StyledNavDropdown>
                  )}
                  {isExperimentalFeaturesEnabled && (
                    <StyledNavDropdown
                      title={
                        selectedSemester && availableSemesters.history ? (
                          <>
                            <ClockHistory />
                            <span className='ms-2'>
                              {this.convertSemesterToDisplay(selectedSemester)}
                            </span>
                          </>
                        ) : (
                          '找尋資料中...'
                        )
                      }
                      id='nav-dropdown-course-history'
                      className='px-3 float-start'
                    >
                      {Object.keys(availableSemesters.history)
                        .sort((a, b) => b.localeCompare(a))
                        .map((year) => ({
                          key: year,
                          label: this.convertSemesterToDisplay(year),
                          value: year,
                        }))
                        .map((semester) => (
                          <NavDropdown.Item
                            key={semester.key}
                            onClick={() => onSemesterChange(semester.value)}
                          >
                            {semester.label}
                          </NavDropdown.Item>
                        ))}
                    </StyledNavDropdown>
                  )}
                </Nav.Item>
                <Nav.Item className='d-flex align-items-center'>
                  <Nav.Link
                    onClick={toggleExperimentalFeatures}
                    className='px-3 d-flex align-items-center'
                  >
                    <Moisture />
                    <span className='ms-2'>
                      {isExperimentalFeaturesEnabled
                        ? '關閉實驗性功能'
                        : '開啟自動更新API (實驗性)'}
                    </span>
                  </Nav.Link>
                </Nav.Item>
              </Nav>
              <Nav
                className='justify-content-end flex-grow-1'
                activeKey={currentTab}
              >
                {this.navTabs.map((tab) => (
                  <Nav.Item key={tab.title}>
                    <StyledNavLink
                      href={`#${tab.title.toLowerCase().replace(/\s+/g, '-')}`}
                      onClick={() => this.handleNavClick(tab.title)}
                      className={
                        tab.title === currentTab ? 'px-3 active' : 'px-3'
                      }
                    >
                      <span className='d-block d-md-none d-xl-block'>
                        {tab.icon}
                      </span>
                      <span className='ms-2'>{tab.title}</span>
                    </StyledNavLink>
                  </Nav.Item>
                ))}
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </StyledNavbar>
    );
  }
}

export default Header;
