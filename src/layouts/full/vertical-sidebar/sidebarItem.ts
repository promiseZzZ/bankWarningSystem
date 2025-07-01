import {UserIcon,HeartRateMonitorIcon, ChartDots2Icon, 
    ChecklistIcon, AntennaBars5Icon, AntennaBarsOffIcon,} from 'vue-tabler-icons';

export interface menu {
    header?: string;
    title?: string;
    icon?: any;
    to?: string;
    chip?: string;
    chipColor?: string;
    chipVariant?: string;
    chipIcon?: string;
    children?: menu[];
    disabled?: boolean;
    type?: string;
    subCaption?: string;
}

const sidebarItem: menu[] = [
    { header: '监控告警' },
    {
        title: '性能监控',
        icon: HeartRateMonitorIcon,
        to: '/main/performanceMonitoring'
    },
    {
        title: '性能分析',
        icon: ChartDots2Icon,
        to: '/main/performanceAnalysis'
    },
    {
        title: '告警记录',
        icon: ChecklistIcon,
        to: '/main/alarmRecord'
    },
    { header: '数据分析' },
    {
        title: '离线分析',
        icon: AntennaBarsOffIcon,
        to: '/main/offlineAnalysis'
    },
    {
        title: '实时分析',
        icon: AntennaBars5Icon,
        to: '/main/realTimeAnalysis'
    },
    { header: '账户管理'},
    {
        title: '账户管理',
        icon: UserIcon,
        to: '/main/AccountManage'
    }
];

export default sidebarItem;
