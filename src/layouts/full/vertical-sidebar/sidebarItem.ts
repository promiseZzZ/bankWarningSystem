import {
    LayoutDashboardIcon,  TypographyIcon,UserIcon
} from 'vue-tabler-icons';

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
    { header: 'Home' },
    {
        title: '新闻检测',
        icon: LayoutDashboardIcon,
        to: '/main/dashboard'
    },
    { header: 'Search' },
    {
        title: '记录查询',
        icon: TypographyIcon,
        to: '/main/ui/typography'
    },
    { header: 'Account'},
    {
        title: '账户管理',
        icon: UserIcon,
        to: '/main/ui/accountmanage'
    }
];

export default sidebarItem;
