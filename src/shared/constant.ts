export enum ApiStatus {
    SUCCESS = 1,
    FAIL = 0
}

export enum ProductStatus {
    SOLD = 1,
    INIT = 0,
    APPORVED = 2,
    LOCKED = 3,
    EVICTION = 4
}

export enum TaskStatus {
    STATUS_CANCEL = -1,
    STATUS_INIT = 0,
    STATUS_SUCCESS = 1,
    STATUS_PROCESSING = 2, //giao dịch viên đã bấm tiếp nhận yêu cầu
    STATUS_PROCESS_TO_MNO = 3, //Đã đẩy sang đối tác nhà mạng
    STATUS_REJECT = 4, //Trường hợp cskh từ chối yêu cầu có thể do ảnh bị mờ, lóa, giấy tờ hết hạn cần yêu cầu đại lý update lại thông tin, trạng thái cho phép đại lý cập nhật task
    STATUS_NEW_ORDER = 5, //Đại lý hoàn thành nhập thông thông tin và submit
    STATUS_SUCCESS_PART = 11, // THành công 1 phần
    STATUS_FAIL_OCS = 6, // Thanh toán thành công nhưng fail ở bước call sang OCS,
    STATUS_INIT_2G_GSIM = 20,
    STATUS_INIT_2G_TS_GSIM = 30,
    STATUS_APPROVE_2G_TS_GSIM = 31
}

export enum ProductCategory {
    MSISDN = 3,
    SERIAL = 2
}

export enum DocumentsType {
    HOP_DONG = 'hop_dong',
    PHIEU_YEU_CAU = 'phieu_yeu_cau',
    PHIEU_THAY_DOI_THONG_TIN = 'phieu_thay_doi_thong_tin',
    CHUYEN_TRA_TRUOC_TRA_SAU = 'chuyen_tra_truoc_tra_sau', // chuyen từ trả sau sang trả trước
    CHUYEN_TRA_SAU_TRA_TRUOC = 'chuyen_tra_sau_tra_truoc' // chuyển từ trả trước sang trả sau
}

export enum DocumentsAction {
    THEM_CHU_KY = 'them_chu_ky',
    TAO_MOI = 'tao_moi'
}

export enum OrderStatus {
    SUCCESS = 1,
    INIT = 0,
    CANCEL = -1,
    STATUS_PROCESSING = 2, //giao dịch viên đã bấm tiếp nhận yêu cầu
    // STATUS_RECEVED = 2, //giao dịch viên đã bấm tiếp nhận yêu cầu
    STATUS_PROCESS_TO_MNO = 3, //Đã đẩy sang đối tác nhà mạng
    STATUS_REJECT = 4, //Trường hợp cskh từ chối yêu cầu có thể do ảnh bị mờ, lóa, giấy tờ hết hạn cần yêu cầu đại lý update lại thông tin, trạng thái cho phép đại lý cập nhật task
    STATUS_NEW_ORDER = 5, //Đại lý hoàn thành nhập thông thông tin và submit
    STATUS_SUCCESS_PART = 11
}

export enum TransType {
    RECHARGE = 'RECHARGE',
    TOPUP_PHONE = 'TOPUP_PHONE',
    PAY_VIRTUAL_NUMBER = 'PAY_VIRTUAL_NUMBER'
}

export enum ACCOUNT_PAYMENT_TYPE {
    M = 'M',
    O = 'O'
}

export enum TaskAction {
    ORDER_NUMBER = "ORDER_NUMBER",
    TOPUP = "TOPUP",
    TOPUP_2G = "TOPUP_2G",
    REQUIRE_TO_PREPAID = "REQUIRE_TO_PREPAID",
    CONVERT_TO_PREPAID = "CONVERT_TO_PREPAID",
    GENERATE_CONTRACT = 'GENERATE_CONTRACT',
    EVICTION = "EVICTION",
    CHARGE_SERVICE = "CHARGE_SERVICE"
}


export enum EKycAPI {
    STATUS_APPROVED = "APPROVED",
    STATUS_INIT = "INIT"
}

export enum eKycType {
    APP = "app", //su dung cho s198
    SIM = "sim"  //su dung cho dang ky sim so
}

export enum MsisdnStatus {
    STATUS_SUCCESS = 1,
    STATUS_NOT_PROCESS_MNO = 2,
    STATUS_PROCESSED_MNO_FAIL = 3,
    STATUS_2G = 10,
    STATUS_EVICTION = 20
}

export enum OcsStatus {
    STATUS_SUCCESS = 1,
    STATUS_FAIL = 0
}

export enum AdminTaskProcess {
    TIME_PROCESS = 10, //minute thoi gian giao dich vien thuc hien 1 task
}

export enum TELCO {
    VNM = 'VNM',
    VMS = 'VMS',
    VTT = 'VTT',
    GSIM = 'GSIM'
}

export enum TaskDetailTopup {
    MOBILE = 'mobile',
    AMOUNT = 'amount',
    BONUS = 'bonus'
}

export enum FILE_KEY {
    GTALK_CONTRACT = 'gtalk_contract'
}

export enum TASK_DETAIL {
    GConversion = '2G_Conversion'
}

export enum SUB_ACTION {
    TRA_SAU_SANG_TRA_TRUOC = 'tra_sau_sang_tra_truoc',
    TRA_TRUOC = 'tra_truoc'
}

export enum SERVICE_CODE {
    VOICE_OTP = 'VOICE_OTP'
}

export enum SERVICE_DETAIL {
    message_confirm = 'message_confirm', //tin nhắn xác nhận đăng ký dịch vụ, nhập mã OTP
    message_success = 'message_success'
}

export enum TEMPLATE_VARIABLE {
    SERVICE_CODE = '{{service_code}}',
    OTP = '{{otp}}',
    AMOUNT = '{{amount}}',
    MOBILE = '{{mobile}}',
}

export enum SETTING {
    MAX_OTP_INVALID_COUNT = 5,
    OTP_EXPIRE_TIME = 3,
    TIME_BLOCK_OTP = 60 //thoi gian block vi nhap sai qua so lan OTP
}

export enum RESPONSE_CODE {
    SUCCESS = 'SUCCESS',
    FORBIDDEN = 'FORBIDDEN',
    MERCHANT_NOT_FOUND = 'MERCHANT_NOT_FOUND',
    INVALID_BRANDNAME = 'INVALID_BRANDNAME',
    INVALID_MOBILE_DESTINATION = 'INVALID_MOBILE_DESTINATION',
    INVALID_SIGN = 'INVALID_SIGN',
    INVALID_DATA_REQUEST = 'INVALID_DATA_REQUEST',
    INVALID_STATUS = 'INVALID_STATUS',
    INVALID_OTP = 'INVALID_OTP',
    OTP_EXPIRED = 'OTP_EXPIRED',
    RECORD_NOT_FOUND = 'RECORD_NOT_FOUND',
    NOT_REGISTER_MOBILE_YET = 'NOT_REGISTER_MOBILE_YET',
    INSUFICIENT_BALANCE = 'INSUFICIENT_BALANCE',
    DUPLICATE_ENTRY = 'DUPLICATE_ENTRY',
    INVALID_SERVICE = 'INVALID_SERVICE',
    INVALID_DATE_RANGE = 'INVALID_DATE_RANGE',
    NEED_TO_LIQUIDATE = 'NEED_TO_LIQUIDATE',
    ALREADY_SIGNED = 'ALREADY_SIGNED',
    OTHER_PROCESSING_MSISDN = 'OTHER_PROCESSING_MSISDN',
    TASK_PROCESSING = 'TASK_PROCESSING',
    NOT_MATCH_INFOMATION = 'NOT_MATCH_INFOMATION',
    TIMEOUT = 'TIMEOUT',
    EXCEPTION = 'EXCEPTION',
    INVALID_EKYC = 'INVALID_EKYC'
}