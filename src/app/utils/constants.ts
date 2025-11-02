// Lưu các tham số dùng chung
import { Menu } from '@delon/theme';
import { QueryFilerModel } from '@model';

export const SETTING_KEY_BUILD = `build`;

export const MENU_CONSTANTS: Menu[] = [
  {
    text: 'Trang chủ',
    i18n: 'menu.main',
    group: true,
    hideInBreadcrumb: true,
    children: [
      {
        text: 'Cấu hình',
        i18n: 'menu.setting',
        icon: 'anticon anticon-setting',
        children: [
          {
            text: 'Email template',
            i18n: 'menu.email-template',
            link: '/sys/email-template'
          }
        ]
      }
    ]
  }
];

export const LIST_USER_STATUS = [
  { id: true, code: true, name: 'Đang hoạt động' },
  { id: false, code: false, name: 'Ngừng hoạt động' }
];

export const LIST_STATUS = [
  { id: true, code: true, name: 'Đang áp dụng' },
  { id: false, code: false, name: 'Ngừng áp dụng' }
];

export const LIST_DOI_TUONG_AP_DUNG = [
  { id: 0, name: 'phan_ca_lam_viec.them_moi.radio.can_bo.title' },
  { id: 1, name: 'phan_ca_lam_viec.them_moi.radio.phong_ban.title' }
];

export const DOI_TUONG_AP_DUNG = {
  CANBO: 0,
  DONVI: 1
};

export const DAY_OF_WEEK = [
  { id: 0, key: 'Sunday', value: 'Chủ nhật' },
  { id: 1, key: 'Monday', value: 'Thứ 2' },
  { id: 2, key: 'Tuesday', value: 'Thứ 3' },
  { id: 3, key: 'Wednesday', value: 'Thứ 4' },
  { id: 4, key: 'Thursday', value: 'Thứ 5' },
  { id: 5, key: 'Friday', value: 'Thứ 6' },
  { id: 6, key: 'Saturday', value: 'Thứ 7' }
];

export const DATE_FORMAT = `dd/MM/yyyy`;
export const DATE_FORMAT_yyyyMMddThhmmss = `yyyy-MM-ddThh:mm:ss`;
export const DATE_FORMAT_YYYYMMDDTHHmmss = `YYYY-MM-DDTHH:mm:ss`;
export const DATE_FORMAT_DDMMYYYYHHmmss = `DD/MM/YYYY HH:mm:ss`;
export const DATE_FORMAT_ddMMyyyyHHmmss = `dd/MM/yyyy HH:mm:ss`;
export const DATE_FORMAT_yyyyMMdd = `yyyy-MM-dd`;
export const DATE_FORMAT_YYYYMMDD = `YYYY-MM-DD`;
export const DATE_FORMAT_dd_MM_yyyy = `dd-MM-yyyy`;
export const DATE_FORMAT_ddMMyyyy = `dd/MM/yyyy`;
export const DATE_FORMAT_DDMMyyyy = `DD/MM/yyyy`;
export const LOCALIZE = 'en-US';

export const REGEX_NAME =
  '^[a-zA-Z0-9_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽếềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳýỵỷỹ -]+';
export const REGEX_CODE = '^[a-zA-Z0-9_-]*$';
export const REGEX_PHONE = '([+]84[3|5|7|8|9]|84[3|5|7|8|9]|0[3|5|7|8|9])+([0-9]{8,10})';
export const REGEX_EMAIL =
  "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$";
export const REGEX_TIMESPAN = '^(((([0-1][0-9])|(2[0-3])):?[0-5][0-9]:?[0-5][0-9]+$))';
export const QUERY_FILTER_DEFAULT: QueryFilerModel = {
  pageNumber: 1,
  pageSize: 10,
  textSearch: undefined,
  showAdSearch: false
};

export const QUERY_FILTER_MIN_DEFAULT: QueryFilerModel = {
  pageNumber: 1,
  pageSize: 5,
  textSearch: undefined,
  showAdSearch: false
};

export const MAX_WITDH_HIDDEN_LEFT_MENU = 890;

export const FORM_TYPE = {
  ADD: 'add',
  INFO: 'info',
  EDIT: 'edit',
  DEL: 'delete'
};

export const AG_GIRD_CELL_STYLE = { 'border-right': '1px solid #DDE2EB' };

export const EVENT_TYPE = {
  SUCCESS_RELOAD: 'success_reload',
  SUCCESS: 'success',
  CONFIRM: 'confirm',
  CLOSE: 'close'
};

export const LIST_SEX = [
  { value: 1, label: 'Nam' },
  { value: 2, label: 'Nữ' },
  { value: 3, label: 'Không xác định' }
];
export const LIST_DEVICE = [
  { value: 'DEVICE_ANDROID', label: 'Android' },
  { value: 'DEVICE_IOS', label: 'iOS' },
  { value: 'DEVICE_MOBILE', label: 'Mobile' },
  { value: 'DEVICE_WEB', label: 'Web' },
  { value: 'DEVICE_3RD', label: '3rdApp' }
];

export const EMAIL_VALIDATION = '[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$';

export const PAGE_SIZE_OPTION_DEFAULT = [5, 10, 20, 50];

export const EXCEL_STYLES_DEFAULT = [
  {
    id: 'greenBackground',
    interior: {
      color: '#b5e6b5',
      pattern: 'Solid'
    }
  },
  {
    id: 'redFont',
    font: {
      fontName: 'Calibri Light',
      underline: 'Single',
      italic: true,
      color: '#ff0000'
    }
  },
  {
    id: 'darkGreyBackground',
    interior: {
      color: '#888888',
      pattern: 'Solid'
    },
    font: {
      fontName: 'Calibri Light',
      color: '#ffffff'
    }
  },
  {
    id: 'boldBorders',
    borders: {
      borderBottom: {
        color: '#000000',
        lineStyle: 'Continuous',
        weight: 3
      },
      borderLeft: {
        color: '#000000',
        lineStyle: 'Continuous',
        weight: 3
      },
      borderRight: {
        color: '#000000',
        lineStyle: 'Continuous',
        weight: 3
      },
      borderTop: {
        color: '#000000',
        lineStyle: 'Continuous',
        weight: 3
      }
    }
  },
  {
    id: 'header',
    interior: {
      color: '#CCCCCC',
      pattern: 'Solid'
    },
    alignment: {
      vertical: 'Center',
      horizontal: 'Center'
    },
    font: {
      bold: true,
      fontName: 'Calibri'
    },
    borders: {
      borderBottom: {
        color: '#5687f5',
        lineStyle: 'Continuous',
        weight: 1
      },
      borderLeft: {
        color: '#5687f5',
        lineStyle: 'Continuous',
        weight: 1
      },
      borderRight: {
        color: '#5687f5',
        lineStyle: 'Continuous',
        weight: 1
      },
      borderTop: {
        color: '#5687f5',
        lineStyle: 'Continuous',
        weight: 1
      }
    }
  },
  {
    id: 'dateFormat',
    dataType: 'dateTime',
    numberFormat: { format: 'mm/dd/yyyy;@' }
  },
  {
    id: 'twoDecimalPlaces',
    numberFormat: { format: '#,##0.00' }
  },
  {
    id: 'textFormat',
    dataType: 'string'
  },
  {
    id: 'bigHeader',
    font: { size: 25 }
  }
];

export const OVERLAY_LOADING_TEMPLATE = '<span class="ag-overlay-loading-center">Đang tải dữ liệu, vui lòng chờ!</span>';

export const OVERLAY_NOROW_TEMPLATE =
  '<span style="padding: 10px; border: 2px solid #444; background: lightgoldenrodyellow;">Không có dữ liệu!</span>';

export const TOKEN_KEY = {
  REDIRECT_AFTER_LOGIN_URL: 'redirect_after_login_url'
};

export const TRANG_THAI_THAM_SO_CONSTANTS = [
  { value: true, label: 'Đang sử dụng' },
  { value: false, label: 'Ngừng sử dụng' }
];
