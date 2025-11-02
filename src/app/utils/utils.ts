import { FormGroup } from '@angular/forms';

// Lưu các hàm dùng chung
export const stringToBoolean = (item: string) => {
  switch (item) {
    case 'Bắt buộc':
    case 'Sử dụng':
    case 'Hoạt động':
    case 'Đang áp dụng':
    case 'true':
    case 'yes':
    case '1':
      return true;
    case 'Không sử dụng':
    case 'Không hoạt động':
    case 'Ngừng áp dụng':
    case 'false':
    case 'no':
    case '0':
    case null:
      return false;
    default:
      return Boolean(item);
  }
};

export const numberWithCommas = (item: string) => {
  return item.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const cleanForm = (formGroup: FormGroup) => {
  Object.keys(formGroup.controls).forEach(key => {
    if (typeof formGroup.get(key)?.value === 'string') {
      // console.log(formGroup.get(key)?.value);
      formGroup.get(key)?.setValue(formGroup.get(key)?.value.trim());
    }
  });
};

export const base64ToArrayBuffer = (base64: string) => {
  let binary_string = base64.replace(/\\n/g, '');
  binary_string = window.atob(base64);
  const len = binary_string.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
};

export const getLocation = () => {
  const geolocation = navigator.geolocation;
  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };
  let lat = 0;
  let long = 0;
  if (geolocation) {
    geolocation.getCurrentPosition(
      // tslint:disable-next-line:only-arrow-functions
      (position: any) => {
        if (position?.coords) {
          lat = position?.coords?.latitude;
          long = position?.coords?.longitude;
          sessionStorage.setItem('location', btoa(JSON.stringify({ latitude: lat, longitude: long })));
        }
      },
      (err: any) => {},
      options
    );
  } else {
    console.log('Trình duyệt của bạn không hỗ trợ Geolocation.');
  }
};

export const getOperatingSystem = () => {
  var browserInfo = getBrowserInfo();

  const navigator: any = window.navigator;
  const operatingSystem = {
    appCodeName: navigator.appCodeName,
    appName: navigator.appName,
    appVersion: navigator.appVersion,
    userAgent: navigator.userAgent,
    language: navigator.language,
    oscpu: navigator.oscpu,
    deviceMemory: navigator.deviceMemory,
    platform: navigator.platform,
    vendor: navigator.vendor,
    vendorSub: navigator.vendorSub,
    Product: navigator.product,
    productSub: navigator.productSub,
    cookieEnabled: navigator.cookieEnabled,
    deviceName: browserInfo.browserName,
    deviceVersion: browserInfo.browserVersion
  };
  const operatingSystemBase64 = btoa(JSON.stringify(operatingSystem));
  sessionStorage.setItem('operating-system', operatingSystemBase64);
};

export const getBrowserInfo = () => {
  const userAgent = navigator.userAgent;
  let browserName = 'Unknown';
  let browserVersion = 'Unknown';

  // Kiểm tra trình duyệt và phiên bản dựa trên userAgent
  if (userAgent.match(/chrome|chromium|crios/i)) {
    browserName = 'Chrome';
    browserVersion = userAgent.match(/chrom(?:e|ium|ios)\/(\d+)/i)?.[1] ?? 'Unknown';
  } else if (userAgent.match(/firefox|fxios/i)) {
    browserName = 'Firefox';
    browserVersion = userAgent.match(/firefox\/(\d+)/i)?.[1] ?? 'Unknown';
  } else if (userAgent.match(/safari/i)) {
    browserName = 'Safari';
    browserVersion = userAgent.match(/version\/(\d+)/i)?.[1] ?? 'Unknown';
  } else if (userAgent.match(/opr\//i)) {
    browserName = 'Opera';
    browserVersion = userAgent.match(/opr\/(\d+)/i)?.[1] ?? 'Unknown';
  } else if (userAgent.match(/edg/i)) {
    browserName = 'Edge';
    browserVersion = userAgent.match(/edg\/(\d+)/i)?.[1] ?? 'Unknown';
  } else if (userAgent.match(/msie|trident/i)) {
    browserName = 'Internet Explorer';
    browserVersion = userAgent.match(/(?:msie (\d+)|rv:(\d+))/i)?.[1] ?? 'Unknown';
  }

  return { browserName, browserVersion };
};

export const isNullOrEmpty = (item: any) => {
  return item === null || item === undefined || item === '';
};
